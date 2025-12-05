// src/components/TaskCard.tsx
'use client';
import { Card, Dropdown, Button } from 'react-bootstrap';
import { formatDistanceToNow } from 'date-fns';

export default function TaskCard({ task, onToggle, onDelete, onEdit }: any) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="h6 mb-0">{task.title}</Card.Title>
          <small className="text-muted status-title">{task.status}</small>
        </div>
        <Card.Text className="flex-grow-1 text-muted">
          {task.description || <span className="text-secondary">No description</span>}
        </Card.Text>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <small className="text-muted">{formatDistanceToNow(new Date(task.createdAt))} ago</small>

          <div className="d-flex align-items-center">
            <Dropdown align="end">
              <Dropdown.Toggle size="sm" variant="secondary">{task.status}</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => onEdit(task)}>Edit</Dropdown.Item>
                <Dropdown.Item onClick={() => onToggle(task.id)}>{task.status === 'NEW' ? 'Mark as Done' : 'Mark as New'}</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="text-danger" onClick={() => onDelete(task.id)}>Delete</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
