export default function Header({ onAdd }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">✓</span>
          <span className="brand-name">TaskFlow</span>
        </div>
        <nav className="nav" aria-label="Main">
          <span className="nav-link active">Dashboard</span>
        </nav>
        <button className="btn btn-primary header-add" onClick={onAdd}>
          Add task
        </button>
      </div>
    </header>
  );
}
