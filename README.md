# TaskFlow – React Task Manager

A beginner-friendly task manager built with React, Vite, JavaScript and CSS. No backend; tasks are saved in your browser's localStorage.

## Setup

Requires Node.js 18+.

```bash
cd task-manager
npm install
npm run dev
```

Open the address Vite prints (usually http://localhost:5173).
Other commands: `npm run build` (production build), `npm run preview` (serve the build).

## Project structure

```
task-manager/
├── index.html
├── package.json
├── vite.config.js
├── public/
└── src/
    ├── main.jsx              # Mounts <App /> into #root
    ├── App.jsx               # All state + add/toggle/delete/clear logic
    ├── index.css             # Global styles, responsive layout
    ├── utils/
    │   └── taskUtils.js      # Pure logic: storage, stats, filter/search/sort
    └── components/
        ├── Header.jsx        # App name, nav, Add task button
        ├── TaskStats.jsx     # Four statistic cards
        ├── TaskFilters.jsx   # Search, filters, sort, Clear completed
        ├── TaskList.jsx      # List + empty states
        ├── TaskItem.jsx      # One task card
        └── TaskForm.jsx      # Add-task modal
```

One deliberate addition: `utils/taskUtils.js` holds the business logic (storage, statistics, filtering) so components stay focused on presentation.

## How it works

### useState – remembering things
`useState` gives a component memory that triggers a re-render when changed. `App.jsx` keeps:

- `tasks` – the array of all tasks (the single source of truth)
- `filter`, `search`, `sort` – what the user is currently viewing
- `showForm` – whether the Add Task modal is open

We never edit `tasks` in place. We build a new array and pass it to `setTasks`, because React only notices changes when it gets a new value.

### Statistics are derived, not stored
`getStats(tasks)` counts the tasks every render. There is no separate "completed count" variable that could get out of sync, so the cards update instantly on any change. With zero tasks the rate is 0%.

### useEffect – side effects
Saving to localStorage is a side effect (it reaches outside React). This runs after render whenever `tasks` changes:

```js
useEffect(() => { saveTasks(tasks); }, [tasks]);
```

Loading happens once at startup via a lazy initializer: `useState(loadTasks)`.

### CRUD operations
| Operation | Function | Array method |
|-----------|----------|--------------|
| Create | `addTask` | `[newTask, ...prev]` |
| Read | `filterAndSortTasks` | `.filter()`, `.sort()`, `.map()` in `TaskList` |
| Update | `toggleTask` | `.map()` swaps `completed` on one task |
| Delete | `deleteTask`, `clearCompleted` | `.filter()` keeps the rest |

Complete/Undo only flips a boolean on an existing task, so it can never create duplicates.

### localStorage
Browser storage holds strings, so we `JSON.stringify` on save and `JSON.parse` on load, under the key `task-manager-tasks`. `loadTasks` is defensive: missing data, broken JSON, a non-array value, or malformed entries all fall back safely to valid tasks or an empty list instead of crashing.

### Filters, search and sort together
`filterAndSortTasks` applies the status filter, then the title search, then the sort, on a copy of the data. Changing the view never modifies stored tasks. "Clear completed tasks" is the only filter-bar action that deletes, and it asks for confirmation first.

## Verification checklist

- [ ] Empty title is rejected with a message; form clears after a successful add
- [ ] Add three tasks: Total = 3, Pending = 3, Completed = 0, Rate = 0%
- [ ] Complete one: Pending 2, Completed 1, Rate 33%, title struck through, badge changes
- [ ] Undo it: stats return to 3 / 3 pending / 0%
- [ ] Delete a task: confirm dialog appears, Total decreases
- [ ] Filter Pending: only pending tasks shown
- [ ] Filter Completed: only completed tasks shown
- [ ] Search by title (partial, any case); combines with filters
- [ ] Newest first / Oldest first reorders correctly
- [ ] No matches shows the "No matching tasks" message
- [ ] Refresh the browser: all tasks and statuses remain
- [ ] Clear completed: only completed tasks removed, pending untouched
- [ ] Zero tasks: all stats show 0 and the empty state offers Add your first task
- [ ] Layout works at desktop, tablet and phone widths
- [ ] Corrupt data test: run `localStorage.setItem('task-manager-tasks','{bad')` in the console, reload; app loads with no tasks
