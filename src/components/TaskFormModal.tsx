// // src/components/TaskFormModal.tsx
// 'use client';
// import { Modal, Button, Form } from 'react-bootstrap';
// import { useForm } from 'react-hook-form';
// import api from '../lib/api';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { useToast } from './ToasterProvider';

// const schema = z.object({
//   title: z.string().min(1),
//   description: z.string().optional(),
//   status: z.enum(['TODO','IN_PROGRESS','DONE','ARCHIVED']).optional(),
// });

// type FormData = z.infer<typeof schema>;

// export default function TaskFormModal({ show = false, onHide, onSaved, initial }: any) {
//   const toast = useToast();
//   const { register, handleSubmit, reset } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: initial || {} });

//   async function onSubmit(data: FormData) {
//     try {
//       if (initial?.id) {
//         await api.patch(`/tasks/${initial.id}`, data);
//         toast.success('Updated');
//       } else {
//         await api.post('/tasks', data);
//         toast.success('Created');
//       }
//       onSaved?.();
//       reset();
//     } catch (err: any) {
//       toast.error(err?.response?.data?.message || 'Save failed');
//     }
//   }

//   return (
//     <Modal show={show} onHide={onHide} centered>
//       <Form onSubmit={handleSubmit(onSubmit)}>
//         <Modal.Header closeButton>
//           <Modal.Title>{initial ? 'Edit Task' : 'New Task'}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form.Group className="mb-2">
//             <Form.Label>Title</Form.Label>
//             <Form.Control {...register('title')} />
//           </Form.Group>
//           <Form.Group className="mb-2">
//             <Form.Label>Description</Form.Label>
//             <Form.Control {...register('description')} as="textarea" rows={3} />
//           </Form.Group>
//           <Form.Group>
//             <Form.Label>Status</Form.Label>
//             <Form.Select {...register('status')} defaultValue={initial?.status || 'TODO'}>
//               <option value="TODO">TODO</option>
//               <option value="IN_PROGRESS">IN PROGRESS</option>
//               <option value="DONE">DONE</option>
//               <option value="ARCHIVED">ARCHIVED</option>
//             </Form.Select>
//           </Form.Group>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={onHide}>Cancel</Button>
//           <Button type="submit" variant="primary">Save</Button>
//         </Modal.Footer>
//       </Form>
//     </Modal>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import api from "@/lib/api";
import { useToast } from "@/components/ToasterProvider";

export default function TaskFormModal({
  show,
  onClose,
  task,
  refetch,
}: {
  show: boolean;
  onClose: () => void;
  task?: any | null;
  refetch: () => void;
}) {
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  /** 🟦 Load task data when editing */
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [task]);

  const handleSubmit = async () => {
    try {
      const payload = { title, description };

      /** 🟦 EDIT mode */
      if (task && task.id) {
        await api.patch(`/tasks/${task.id}`, payload);
        toast.success("Task updated!");
      }
      /** 🟩 CREATE mode */
      else {
        await api.post("/tasks", payload);
        toast.success("Task created!");
      }

      refetch();
      onClose();
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{task ? "Edit Task" : "Create Task"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              as="textarea"
              rows={3}
              placeholder="Enter description"
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>

        <Button variant="primary" onClick={handleSubmit}>
          {task ? "Update Task" : "Create Task"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
