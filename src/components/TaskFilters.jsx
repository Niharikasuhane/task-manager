const FILTERS = [
  { value: 'all', label: 'All tasks' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
];

export default function TaskFilters({
  filter,
  onFilterChange,
  search,
  onSearchChange,
  sort,
  onSortChange,
  onClearCompleted,
  completedCount,
}) {
  return (
    <section className="controls" aria-label="Search and filter">
      <input
        type="search"
        className="input search"
        placeholder="Search tasks by title"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search tasks by title"
      />

      <div className="segmented" role="group" aria-label="Filter tasks">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`segment ${filter === f.value ? 'active' : ''}`}
            onClick={() => onFilterChange(f.value)}
            aria-pressed={filter === f.value}
          >
            {f.label}
          </button>
        ))}
      </div>

      <select
        className="input select"
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label="Sort tasks"
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
      </select>

      <button
        className="btn btn-ghost-danger"
        onClick={onClearCompleted}
        disabled={completedCount === 0}
      >
        Clear completed tasks
      </button>
    </section>
  );
}
