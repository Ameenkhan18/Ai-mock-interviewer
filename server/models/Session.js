const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    feedback: {
      clarity: { type: Number, min: 0, max: 10 },
      relevance: { type: Number, min: 0, max: 10 },
      depth: { type: Number, min: 0, max: 10 },
      overallScore: { type: Number, min: 0, max: 10 },
      comments: { type: String },
      improvementTips: { type: String }
    }
  },
  { _id: false }
);

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    role: {
      type: String,
      required: true,
      trim: true
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate'
    },
    questions: [{ type: String }],
    answers: [answerSchema],
    averageScore: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed'],
      default: 'in-progress'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Session', sessionSchema);
