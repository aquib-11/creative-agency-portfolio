const METRICS = [
  { key: 'rating',        label: 'Rating',          icon: '⭐' },
  { key: 'reviewVolume',  label: 'Review Volume',   icon: '📝' },
  { key: 'reviewRecency', label: 'Review Recency',  icon: '🕐' },
  { key: 'responseRate',  label: 'Response Rate',   icon: '💬' },
  { key: 'contentQuality',label: 'Content Quality', icon: '📸' },
];

function barColor(val) {
  if (val >= 80) return '#22c55e';
  if (val >= 50) return '#eab308';
  return '#ef4444';
}

export default function HealthScoreCard({ score, breakdown }) {
  const ringColor = barColor(score);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="font-bold text-lg mb-4">Health Report Card</h3>

      {/* Ring + Score */}
      <div className="flex items-center gap-5 mb-6">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1f2937" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15.9"
              fill="none"
              stroke={ringColor}
              strokeWidth="3"
              strokeDasharray={`${score} 100`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold">{score}</span>
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold">{score}/100</div>
          <div className="text-gray-400 text-sm">Overall Score</div>
        </div>
      </div>

      {/* Breakdown Bars */}
      <div className="space-y-3">
        {METRICS.map(({ key, label, icon }) => (
          <div key={key}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">{icon} {label}</span>
              <span className="font-bold">{breakdown[key]}</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${breakdown[key]}%`,
                  backgroundColor: barColor(breakdown[key]),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}