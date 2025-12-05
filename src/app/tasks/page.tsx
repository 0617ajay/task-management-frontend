// app/tasks/page.tsx
'use client';
import { useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import TaskCard from '@/components/TaskCard';
import TaskFormModal from '@/components/TaskFormModal';
import { useTasks } from '@/hooks/useTask';
import ProtectedRoute from '@/components/ProtectedRoutes';
import Pagination from '@/components/Pagination';
import { useDebounce } from '@/hooks/useDebounce';
import TaskSkeleton from '@/components/TaskSkeleton';
import { useResponsiveSkeleton } from '@/hooks/useResponsiveSkeleton';

const limit = 9;

export default function TasksPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTask, setSelectedTask] = useState(undefined);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const skeletons = useResponsiveSkeleton();

  const debouncedQ = useDebounce(q, 400);

  const { data, isLoading, toggleTask, deleteTask, refetch } = useTasks({
    page,
    limit,
    status,
    q: debouncedQ
  });

  return (
    <ProtectedRoute>
      <Container>
        <Row className="align-items-center mb-3">
          <Col md={6}>
            <h2 className="mb-0">Tasks</h2>
            <small className="text-muted d-block">Manage your tasks securely</small>
          </Col>
          <Col md={6} className="text-md-end mt-3 mt-md-0">
            <Button variant="primary" onClick={() => setShowCreate(true)}>
              Add Task
            </Button>
          </Col>
        </Row>

        <Row className="mb-3 g-2">
          <Col md={6}>
            <Form.Control
              placeholder="Search by title or description"
              value={q}
              onChange={(e) => {
                setPage(1);      // Reset to page 1 when searching
                setQ(e.target.value);
              }}
            />
          </Col>

          <Col md={3}>
            <Form.Select
              value={status || ''}
              onChange={(e) => {
                setPage(1);      // Reset pagination on filter change
                setStatus(e.target.value || undefined);
              }}
            >
              <option value="">All status</option>
              <option value="NEW">New</option>
              <option value="DONE">Done</option>
            </Form.Select>
          </Col>

          <Col md={3}>
            <Button variant="outline-secondary" onClick={() => refetch()}>
              Refresh
            </Button>
          </Col>
        </Row>

        <Row xs={1} md={3} className="g-3">
          {isLoading &&
                Array.from({ length: skeletons }).map((_, i) => (
                  <Col key={i}>
                    <TaskSkeleton />
                  </Col>
                ))
              }
          { !isLoading && data?.tasks?.length === 0 && <div className="p-4">No tasks found.</div>}

          {!isLoading && data?.tasks?.map((task: any) => (
            <Col key={task.id}>
              <TaskCard
                task={task}
                onToggle={() => toggleTask(task.id)}
                onDelete={() => deleteTask(task.id)}
                onEdit={() => {
                  setSelectedTask(task);
                  setShowCreate(true);
                }}
              />
            </Col>
          ))}
        </Row>

        <Pagination
          page={page}
          limit={limit}
          total={data?.total || 0}
          onPageChange={setPage}
        />

        <TaskFormModal
          show={showCreate}
          task={selectedTask}
          onClose={() => {
            setSelectedTask(undefined);
            setShowCreate(false);
          }}
          refetch={() => {
            setSelectedTask(undefined);
            setShowCreate(false);
            refetch();
          }}
        />
      </Container>
    </ProtectedRoute>
  );
}
