import { useEffect, useRef, useState } from 'react';

// Modal form for adding a task.
export default function TaskForm({ onAdd, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const titleRef = useRef(null);

  // Focus the title field on open; close on Escape.
  useEffect(() => {
    titleRef.current?.focus();
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Enter a task title to continue.');
      return;
    }
    const added = onAdd(title, description);
    if (added) {
      // Clear the form after a successful add, then close.
      setTitle('');
      setDescription('');
      setError('');
      onClose();
    }
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={handleSubmit} noValidate aria-labelledby="form-title">
        <h2 id="form-title">Add a task</h2>

        <label className="field">
          <span>Title</span>
          <input
            ref={titleRef}
            className={`input ${error ? 'input-error' : ''}`}
            value={title}
            maxLength={120}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            placeholder="What needs to be done?"
          />
          {error && <span className="error" role="alert">{error}</span>}
        </label>

        <label className="field">
          <span>Description (optional)</span>
          <textarea
            className="input"
            rows={3}
            value={description}
            maxLength={500}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add any details"
          />
        </label>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Add task
          </button>
        </div>
      </form>
    </div>
  );
}
