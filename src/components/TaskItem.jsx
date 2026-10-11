import { formatDate } from '../utils/taskUtils.js';

export default function TaskItem({ task, onToggle, onDelete }) {
  const { id, title, description, createdAt, completed } = task;

  return (
    <li className={`task ${completed ? 'is-completed' : 'is-pending'}`}>
      <div className="task-body">
        <div className="task-head">
          <h3 className="task-title">{title}</h3>
          <span className={`badge ${completed ? 'badge-completed' : 'badge-pending'}`}>
            {completed ? 'Completed' : 'Pending'}
          </span>
        </div>
        {description && <p className="task-desc">{description}</p>}
        <p className="task-date">Created {formatDate(createdAt)}</p>
      </div>

      <div className="task-actions">
        <button
          className={`btn ${completed ? 'btn-secondary' : 'btn-primary'}`}
          onClick={() => onToggle(id)}
        >
          {completed ? 'Undo' : 'Mark complete'}
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(id)}>
          Delete
        </button>
      </div>
    </li>
  );
}
