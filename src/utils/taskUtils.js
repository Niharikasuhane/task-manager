// Pure helper functions: storage, task creation, statistics, filtering.
// Keeping them out of the components makes the UI code easier to read.

export const STORAGE_KEY = 'task-manager-tasks';

/** A saved task must look like this, otherwise we ignore it. */
function isValidTask(task) {
  return (
    task !== null &&
    typeof task === 'object' &&
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    task.title.trim() !== '' &&
    typeof task.completed === 'boolean' &&
    typeof task.createdAt === 'string' &&
    !Number.isNaN(Date.parse(task.createdAt))
  );
}

/** Read tasks from localStorage. Never throws: bad data becomes []. */
export function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidTask);
  } catch {
    return []; // corrupted JSON or storage blocked
  }
}

/** Write tasks to localStorage. Fails quietly (e.g. private mode, quota). */
export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    console.warn('Could not save tasks to localStorage.');
  }
}

/** Unique id: crypto.randomUUID when available, otherwise a fallback. */
function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Build a new task object. Returns null if the title is empty. */
export function createTask(title, description) {
  const cleanTitle = title.trim();
  if (!cleanTitle) return null;
  return {
    id: generateId(),
    title: cleanTitle,
    description: description.trim(),
    completed: false, // new tasks are always Pending
    createdAt: new Date().toISOString(),
  };
}

/** Statistics are always calculated from the tasks array, never hardcoded. */
export function getStats(tasks) {
  const total = tasks.length;
  const completed = tasks.reduce((count, t) => (t.completed ? count + 1 : count), 0);
  const pending = total - completed;
  const rate = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, pending, rate };
}

/** Apply filter + search + sort together. Returns a NEW array. */
export function filterAndSortTasks(tasks, { filter, search, sort }) {
  const query = search.trim().toLowerCase();

  return tasks
    .filter((t) => {
      if (filter === 'pending') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true; // 'all'
    })
    .filter((t) => t.title.toLowerCase().includes(query))
    .sort((a, b) => {
      const diff = Date.parse(a.createdAt) - Date.parse(b.createdAt);
      return sort === 'oldest' ? diff : -diff;
    });
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
