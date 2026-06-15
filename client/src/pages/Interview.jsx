import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getSession, submitAnswer } from '../services/api';
import FeedbackCard from '../components/FeedbackCard';

export default function Interview() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { session: s } = await getSession(sessionId);
        setSession(s);
        setCurrentIndex(s.answers.length);
      } catch (err) {
        console.error(err);
        setError('Failed to load session.');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) {
      setError('Please write an answer before submitting.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const question = session.questions[currentIndex];
      const { feedback: fb, session: updated } = await submitAnswer(
        sessionId,
        question,
        answer.trim()
      );
      setFeedback(fb);
      setSession(updated);
    } catch (err) {
      console.error(err);
      setError('Failed to submit answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setAnswer('');
    setCurrentIndex((prev) => prev + 1);
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-500">Loading interview...</div>;
  }

  if (!session) {
    return <div className="text-center py-20 text-red-500">{error || 'Session not found.'}</div>;
  }

  const totalQuestions = session.questions.length;
  const isFinished = currentIndex >= totalQuestions;
  const currentQuestion = session.questions[currentIndex];

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Interview Complete!</h2>
          <p className="text-slate-500 mb-6">
            Role: <span className="font-medium">{session.role}</span> | Difficulty:{' '}
            <span className="font-medium">{session.difficulty}</span>
          </p>
          <div className="text-5xl font-bold text-primary-600 mb-2">
            {session.averageScore.toFixed(1)} / 10
          </div>
          <p className="text-slate-500 mb-8">Average Score</p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/"
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Start New Interview
            </Link>
            <Link
              to="/history"
              className="border border-slate-300 hover:border-primary-500 text-slate-600 font-medium px-6 py-3 rounded-lg transition-colors"
            >
              View History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-slate-500">
          Question {currentIndex + 1} of {totalQuestions}
        </span>
        <span className="text-sm font-medium text-primary-600">
          {session.role} · {session.difficulty}
        </span>
      </div>

      <div className="w-full bg-slate-200 rounded-full h-2 mb-6">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all"
          style={{ width: `${(currentIndex / totalQuestions) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{currentQuestion}</h3>

        {!feedback ? (
          <form onSubmit={handleSubmit}>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={6}
              placeholder="Type your answer here..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4 resize-none"
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {submitting ? 'Evaluating...' : 'Submit Answer'}
            </button>
          </form>
        ) : (
          <>
            <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600 mb-2">
              <span className="font-medium">Your answer: </span>
              {answer}
            </div>
            <FeedbackCard feedback={feedback} />
            <button
              onClick={handleNext}
              className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {currentIndex + 1 < totalQuestions ? 'Next Question' : 'Finish Interview'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
