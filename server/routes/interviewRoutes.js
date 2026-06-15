const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const { generateQuestions, evaluateAnswer } = require('../services/openaiService');

/**
 * POST /api/interview/start
 * Body: { userId, role, difficulty }
 * Creates a new session with AI-generated questions.
 */
router.post('/start', async (req, res) => {
  try {
    const { userId, role, difficulty } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ error: 'userId and role are required' });
    }

    const questions = await generateQuestions(role, difficulty || 'Intermediate', 5);

    if (!questions.length) {
      return res.status(502).json({ error: 'Failed to generate questions' });
    }

    const session = await Session.create({
      userId,
      role,
      difficulty: difficulty || 'Intermediate',
      questions,
      answers: [],
      status: 'in-progress'
    });

    res.status(201).json({ session });
  } catch (error) {
    console.error('Error starting interview:', error);
    res.status(500).json({ error: 'Failed to start interview session' });
  }
});

/**
 * POST /api/interview/:sessionId/answer
 * Body: { question, answer }
 * Evaluates an answer and stores feedback.
 */
router.post('/:sessionId/answer', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: 'question and answer are required' });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const feedback = await evaluateAnswer(session.role, question, answer);

    session.answers.push({ question, answer, feedback });

    const totalScore = session.answers.reduce(
      (sum, a) => sum + (a.feedback?.overallScore || 0),
      0
    );
    session.averageScore = Number((totalScore / session.answers.length).toFixed(1));

    if (session.answers.length >= session.questions.length) {
      session.status = 'completed';
    }

    await session.save();

    res.json({ feedback, session });
  } catch (error) {
    console.error('Error evaluating answer:', error);
    res.status(500).json({ error: 'Failed to evaluate answer' });
  }
});

/**
 * GET /api/interview/:sessionId
 * Fetch a single session by ID.
 */
router.get('/:sessionId', async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json({ session });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

/**
 * GET /api/interview/history/:userId
 * Fetch all sessions for a user, most recent first.
 */
router.get('/history/:userId', async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .select('-answers.feedback.comments -answers.feedback.improvementTips');

    res.json({ sessions });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

/**
 * DELETE /api/interview/:sessionId
 */
router.delete('/:sessionId', async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json({ message: 'Session deleted' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

module.exports = router;
