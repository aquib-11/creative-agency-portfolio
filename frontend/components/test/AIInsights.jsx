export default function AIInsights({ insights }) {
  if (!insights) return null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">✨</span>
        <h3 className="font-bold text-lg">AI Insights</h3>
        <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded-full ml-1">
          Powered by Gemini
        </span>
      </div>

      {/* Summary */}
      <p className="text-gray-300 mb-5 leading-relaxed">{insights.summary}</p>

      {/* Strengths + Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-green-900/20 border border-green-800 rounded-xl p-4">
          <h4 className="font-semibold text-green-400 mb-2">💪 Strengths</h4>
          <ul className="space-y-1">
            {insights.strengths?.map((s, i) => (
              <li key={i} className="text-sm text-gray-300">• {s}</li>
            ))}
          </ul>
        </div>
        <div className="bg-yellow-900/20 border border-yellow-800 rounded-xl p-4">
          <h4 className="font-semibold text-yellow-400 mb-2">🚀 Opportunities</h4>
          <ul className="space-y-1">
            {insights.opportunities?.map((o, i) => (
              <li key={i} className="text-sm text-gray-300">• {o}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Review Strategy */}
      <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-4 mb-4">
        <h4 className="font-semibold text-blue-400 mb-1">📣 Review Strategy</h4>
        <p className="text-sm text-gray-300">{insights.reviewStrategy}</p>
      </div>

      {/* Quick Wins */}
      <div className="bg-purple-900/20 border border-purple-800 rounded-xl p-4">
        <h4 className="font-semibold text-purple-400 mb-2">⚡ Quick Wins</h4>
        <ul className="space-y-1">
          {insights.quickWins?.map((w, i) => (
            <li key={i} className="text-sm text-gray-300">• {w}</li>
          ))}
        </ul>
        {insights.predictedRankingBoost && (
          <p className="text-xs text-green-400 mt-3">
            📈 {insights.predictedRankingBoost}
          </p>
        )}
      </div>
    </div>
  );
}