import ScoreBadge from './ScoreBadge';

export default function FeedbackCard({ feedback }) {
  if (!feedback) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 mt-4 animate-fade-in">
      <h4 className="font-semibold text-slate-800 mb-4">AI Feedback</h4>
      <div className="flex gap-6 mb-4">
        <ScoreBadge label="Clarity" score={feedback.clarity} />
        <ScoreBadge label="Relevance" score={feedback.relevance} />
        <ScoreBadge label="Depth" score={feedback.depth} />
        <ScoreBadge label="Overall" score={feedback.overallScore} />
      </div>
      <div className="space-y-2 text-sm">
        <p className="text-slate-700">
          <span className="font-medium">Comments: </span>
          {feedback.comments}
        </p>
        <p className="text-slate-700">
          <span className="font-medium">Tip: </span>
          {feedback.improvementTips}
        </p>
      </div>
    </div>
  );
}
