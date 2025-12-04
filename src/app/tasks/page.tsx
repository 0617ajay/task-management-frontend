// app/tasks/page.tsx
'use client';
import { useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import TaskCard from '@/components/TaskCard';
import TaskFormModal from '@/components/TaskFormModal';
import { useTasks } from '@/hooks/useTask';
import ProtectedRoute from '@/components/ProtectedRoutes';

export default function TasksPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTask, setSelectedTask] = useState(undefined);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { data, isLoading, toggleTask, deleteTask, refetch } = useTasks({ page, limit: 9, status, q });
  return (
    <ProtectedRoute>
      <Container>
        <Row className="align-items-center mb-3">
          <Col md={6}>
            <h2 className="mb-0">Tasks</h2>
            <small className="text-muted d-block">Manage your tasks securely</small>
          </Col>
          <Col md={6} className="text-md-end mt-3 mt-md-0">
            <Button variant="primary" onClick={()=>setShowCreate(true)}>Add Task</Button>
          </Col>
        </Row>

        <Row className="mb-3 g-2">
          <Col md={6}>
            <Form.Control placeholder="Search by title" value={q} onChange={(e)=>setQ(e.target.value)} />
          </Col>
          <Col md={3}>
            <Form.Select value={status || ''} onChange={(e)=>setStatus(e.target.value || undefined)}>
              <option value="">All status</option>
              <option value={"NEW"}>New</option>
              <option value={"DONE"}>Done</option>
            </Form.Select>
          </Col>
          <Col md={3} className="text-md-end">
            <Button variant="outline-secondary" onClick={()=>refetch()}>Refresh</Button>
          </Col>
        </Row>

        <Row xs={1} md={3} className="g-3">
          {isLoading && <div className="p-4 text-center">Loading…</div>}
          {data?.tasks?.length === 0 && <div className="p-4">No tasks found.</div>}
          {data?.tasks?.map((task:any)=>(
            <Col key={task.id}>
              <TaskCard
                task={task}
                onToggle={() => toggleTask(task.id)}
                onDelete={() => deleteTask(task.id)}
                onEdit={() => {setSelectedTask(task);setShowCreate(true)}} // you can pass task to open edit
              />
            </Col>
          ))}
        </Row>

        <div className="d-flex justify-content-center mt-4">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${page<=1?'disabled':''}`}><button className="page-link" onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button></li>
              <li className="page-item disabled"><span className="page-link">Page {page}</span></li>
              <li className={`page-item ${data && page>=Math.ceil(data.total/data.limit)?'disabled':''}`}><button className="page-link" onClick={()=>setPage(p=>p+1)}>Next</button></li>
            </ul>
          </nav>
        </div>

        <TaskFormModal show={showCreate} task={selectedTask} onClose={()=>{setSelectedTask(undefined); setShowCreate(false)}} refetch={()=>{ setSelectedTask(undefined); setShowCreate(false); refetch(); }} />
      </Container>
    </ProtectedRoute>
  );
}
