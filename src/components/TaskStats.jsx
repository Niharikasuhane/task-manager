export default function TaskStats({ stats }) {
  const { total, completed, pending, rate } = stats;

  return (
    <section className="stats" aria-label="Task statistics">
      <div className="stat-card">
        <span className="stat-label">Total tasks</span>
        <span className="stat-value">{total}</span>
      </div>
      <div className="stat-card stat-completed">
        <span className="stat-label">Completed</span>
        <span className="stat-value">{completed}</span>
      </div>
      <div className="stat-card stat-pending">
        <span className="stat-label">Pending</span>
        <span className="stat-value">{pending}</span>
      </div>
      <div className="stat-card stat-rate">
        <span className="stat-label">Completion rate</span>
        <span className="stat-value">{rate}%</span>
        <div
          className="progress"
          role="progressbar"
          aria-valuenow={rate}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Completion rate"
        >
          <div className="progress-fill" style={{ width: `${rate}%` }} />
        </div>
      </div>
    </section>
  );
}
