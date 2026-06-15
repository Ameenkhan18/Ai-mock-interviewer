import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const linkClass = (path) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'bg-primary-600 text-white'
        : 'text-slate-600 hover:bg-primary-50 hover:text-primary-600'
    }`;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold">
            AI
          </div>
          <span className="font-semibold text-slate-800">Mock Interviewer</span>
        </Link>
        <div className="flex gap-2">
          <Link to="/" className={linkClass('/')}>
            New Interview
          </Link>
          <Link to="/history" className={linkClass('/history')}>
            History
          </Link>
        </div>
      </div>
    </nav>
  );
}
