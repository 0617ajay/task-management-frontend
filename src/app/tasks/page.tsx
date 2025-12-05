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

const limit = 6;

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
    q: debouncedQ,
  });

  return (
    <ProtectedRoute>
      {/* Full-page fixed layout */}
      <div
        style={{
          height: 'calc(100vh - 80px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* HEADER + FILTERS (FIXED) */}
        <div style={{ flexShrink: 0, paddingInline: '15px' }}>
          <Container fluid className="pt-2 pb-2">
            <Row className="align-items-center mb-2">
              <Col md={6}>
                <h3 className="mb-0">Tasks</h3>
                <small className="text-muted d-block">
                  Manage your tasks securely
                </small>
              </Col>
              <Col md={6} className="text-md-end mt-2 mt-md-0">
                <Button variant="primary" onClick={() => setShowCreate(true)}>
                  Add Task
                </Button>
              </Col>
            </Row>

            <Row className="g-2 mb-2">
              <Col md={6}>
                <Form.Control
                  placeholder="Search by title or description"
                  value={q}
                  onChange={(e) => {
                    setPage(1);
                    setQ(e.target.value);
                  }}
                />
              </Col>

              <Col md={3}>
                <Form.Select
                  value={status || ''}
                  onChange={(e) => {
                    setPage(1);
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
          </Container>
        </div>

        {/* TASK LIST AREA (SCROLLABLE) */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            paddingInline: '15px',
            paddingTop: '5px',
            paddingBottom: '5px',
          }}
        >
          <Container fluid>
            <Row xs={1} md={2} lg={3} className="g-3">
              {/* Skeleton Loader */}
              {isLoading &&
                Array.from({ length: skeletons }).map((_, i) => (
                  <Col key={i}>
                    <TaskSkeleton />
                  </Col>
                ))}

              {/* Empty State */}
              {!isLoading && data?.tasks?.length === 0 && (
                <div
                  className="w-100 d-flex flex-column justify-content-center align-items-center text-center py-5"
                >
                  <img
                    src="/empty-tasks.png"
                    style={{ width: '180px', opacity: 0.8 }}
                    alt="No tasks"
                  />
                  <h5 className="mt-3">No Tasks Found</h5>
                  <p className="text-muted" style={{ maxWidth: '320px' }}>
                    Try adjusting your search or filters, or create a new task.
                  </p>
                </div>
              )}

              {/* Task Cards */}
              {!isLoading &&
                data?.tasks?.map((task) => (
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
          </Container>
        </div>

        {/* BOTTOM PAGINATION (FIXED) */}
        <div style={{ flexShrink: 0, background: 'white', padding: '10px 0' }}>
          <Container>
            <Pagination
              page={page}
              limit={limit}
              total={data?.total || 0}
              onPageChange={setPage}
            />
          </Container>
        </div>

        {/* CREATE / EDIT MODAL */}
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
      </div>
    </ProtectedRoute>
  );
}
