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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /** 🔄 RESET FORM */
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setError("");
    setLoading(false);
  };

  /** 🟦 Load task data when editing */
  useEffect(() => {
    if (show) {
      if (task) {
        setTitle(task.title);
        setDescription(task.description ?? "");
      } else {
        resetForm();
      }
    }
  }, [show, task]);

  const handleSubmit = async () => {
    // Validation
    if (title.trim().length < 5) {
      setError("Title must be at least 5 characters long");
      return;
    }

    setLoading(true);

    try {
      const payload = { title, description };

      if (task?.id) {
        await api.patch(`/tasks/${task.id}`, payload);
        toast.success("Task updated successfully!");
      } else {
        await api.post("/tasks", payload);
        toast.success("Task added successfully!");
      }

      refetch();
      resetForm();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
      console.error(err);
      setLoading(false);
    }
  };

  /** Cancel → reset form + close */
  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal show={show} onHide={handleCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{task ? "Edit Task" : "Save Task"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>
              Title <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              value={title}
              isInvalid={!!error}
              onChange={(e) => {
                setTitle(e.target.value);
                setError("");
              }}
              placeholder="Enter task title"
              disabled={loading}
            />
            {error && <Form.Text className="text-danger">{error}</Form.Text>}
          </Form.Group>

          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              as="textarea"
              rows={3}
              placeholder="Enter description"
              disabled={loading}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel} disabled={loading}>
          Cancel
        </Button>

        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? (task ? "Updating…" : "Adding…") : task ? "Update" : "Add"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
