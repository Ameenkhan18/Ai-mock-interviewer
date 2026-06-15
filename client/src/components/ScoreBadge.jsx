export default function ScoreBadge({ label, score }) {
  const getColor = (s) => {
    if (s >= 8) return 'bg-green-100 text-green-700';
    if (s >= 5) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`text-lg font-bold w-12 h-12 rounded-full flex items-center justify-center ${getColor(score)}`}>
        {score}
      </span>
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  );
}
