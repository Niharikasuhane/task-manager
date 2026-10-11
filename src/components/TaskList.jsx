import TaskItem from './TaskItem.jsx';

export default function TaskList({
  tasks,
  hasAnyTasks,
  onToggle,
  onDelete,
  onAdd,
  onResetView,
}) {
  // Case 1: nothing saved yet
  if (!hasAnyTasks) {
    return (
      <div className="empty">
        <h2>No tasks yet</h2>
        <p>Add your first task to start tracking what needs to get done.</p>
        <button className="btn btn-primary" onClick={onAdd}>
          Add your first task
        </button>
      </div>
    );
  }

  // Case 2: tasks exist, but none match the search/filter
  if (tasks.length === 0) {
    return (
      <div className="empty">
        <h2>No matching tasks</h2>
        <p>Nothing matches the current search or filter.</p>
        <button className="btn btn-secondary" onClick={onResetView}>
          Show all tasks
        </button>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  );
}
