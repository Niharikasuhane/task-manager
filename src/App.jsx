import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import TaskStats from './components/TaskStats.jsx';
import TaskFilters from './components/TaskFilters.jsx';
import TaskList from './components/TaskList.jsx';
import TaskForm from './components/TaskForm.jsx';
import {
  createTask,
  filterAndSortTasks,
  getStats,
  loadTasks,
  saveTasks,
} from './utils/taskUtils.js';

export default function App() {
  // Lazy initializer: loadTasks runs once, on first render only.
  const [tasks, setTasks] = useState(loadTasks);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest'); // 'newest' | 'oldest'
  const [showForm, setShowForm] = useState(false);

  // Save to localStorage whenever the tasks array changes.
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Derived data: recalculated from `tasks`, never stored separately.
  const stats = useMemo(() => getStats(tasks), [tasks]);
  const visibleTasks = useMemo(
    () => filterAndSortTasks(tasks, { filter, search, sort }),
    [tasks, filter, search, sort]
  );

  // CREATE
  function addTask(title, description) {
    const task = createTask(title, description);
    if (!task) return false;
    setTasks((prev) => [task, ...prev]); // new array, no mutation
    return true;
  }

  // UPDATE: flip completed on one task. Running it again undoes it,
  // and it never adds a task, so duplicates are impossible.
  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  // DELETE (with confirmation)
  function deleteTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    if (window.confirm(`Delete "${task.title}"? This can't be undone.`)) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  }

  // Removes completed tasks only; pending tasks are untouched.
  function clearCompleted() {
    if (stats.completed === 0) return;
    if (window.confirm(`Remove ${stats.completed} completed task(s)?`)) {
      setTasks((prev) => prev.filter((t) => !t.completed));
      setFilter((f) => (f === 'completed' ? 'all' : f));
    }
  }

  function resetView() {
    setSearch('');
    setFilter('all');
  }

  return (
    <div className="app">
      <Header onAdd={() => setShowForm(true)} />

      <main className="container">
        <TaskStats stats={stats} />

        <TaskFilters
          filter={filter}
          onFilterChange={setFilter}
          search={search}
          onSearchChange={setSearch}
          sort={sort}
          onSortChange={setSort}
          onClearCompleted={clearCompleted}
          completedCount={stats.completed}
        />

        <TaskList
          tasks={visibleTasks}
          hasAnyTasks={tasks.length > 0}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onAdd={() => setShowForm(true)}
          onResetView={resetView}
        />
      </main>

      <button
        className="fab"
        onClick={() => setShowForm(true)}
        aria-label="Add task"
        title="Add task"
      >
        +
      </button>

      {showForm && <TaskForm onAdd={addTask} onClose={() => setShowForm(false)} />}
    </div>
  );
}
