import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHistory, deleteSession } from '../services/api';
import { getUserId } from '../utils/userId';

export default function History() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const userId = getUserId();
      const { sessions: data } = await getHistory(userId);
      setSessions(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteSession(id);
      setSessions((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-500">Loading history...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Interview History</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {sessions.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center text-slate-500">
          No past interviews yet.{' '}
          <Link to="/" className="text-primary-600 font-medium">
            Start your first one!
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <div
              key={s._id}
              className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
            >
              <div>
                <h4 className="font-semibold text-slate-800">{s.role}</h4>
                <p className="text-sm text-slate-500">
                  {s.difficulty} · {new Date(s.createdAt).toLocaleDateString()} ·{' '}
                  {s.answers.length}/{s.questions.length} answered ·{' '}
                  <span
                    className={`font-medium ${
                      s.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                    }`}
                  >
                    {s.status}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-lg font-bold text-primary-600">
                    {s.averageScore?.toFixed(1) || '0.0'}
                  </div>
                  <div className="text-xs text-slate-400">avg score</div>
                </div>
                {s.status === 'in-progress' && (
                  <Link
                    to={`/interview/${s._id}`}
                    className="text-sm bg-primary-50 hover:bg-primary-100 text-primary-600 font-medium px-3 py-2 rounded-lg transition-colors"
                  >
                    Continue
                  </Link>
                )}
                <button
                  onClick={() => handleDelete(s._id)}
                  className="text-sm text-red-500 hover:text-red-700 px-2"
                  title="Delete session"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
