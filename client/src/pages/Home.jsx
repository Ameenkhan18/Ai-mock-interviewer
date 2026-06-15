import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startInterview } from '../services/api';
import { getUserId } from '../utils/userId';

const ROLE_SUGGESTIONS = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
  'Product Manager',
  'DevOps Engineer',
  'UI/UX Designer',
  'Software QA Engineer'
];

export default function Home() {
  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleStart = async (e) => {
    e.preventDefault();
    if (!role.trim()) {
      setError('Please enter a job role');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const userId = getUserId();
      const { session } = await startInterview(userId, role.trim(), difficulty);
      navigate(`/interview/${session._id}`);
    } catch (err) {
      console.error(err);
      setError('Failed to start interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Practice Your Next Interview
        </h1>
        <p className="text-slate-500">
          Pick a role, get realistic questions, and receive instant AI feedback.
        </p>
      </div>

      <form onSubmit={handleStart} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Job Role
        </label>
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. Frontend Developer"
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
        />

        <div className="flex flex-wrap gap-2 mb-6">
          {ROLE_SUGGESTIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className="text-xs px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
            >
              {r}
            </button>
          ))}
        </div>

        <label className="block text-sm font-medium text-slate-700 mb-2">
          Difficulty
        </label>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {['Beginner', 'Intermediate', 'Advanced'].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                difficulty === d
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'border-slate-300 text-slate-600 hover:border-primary-500'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-medium py-3 rounded-lg transition-colors"
        >
          {loading ? 'Generating questions...' : 'Start Interview'}
        </button>
      </form>
    </div>
  );
}
