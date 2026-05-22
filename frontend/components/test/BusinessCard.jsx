export default function BusinessCard({ business }) {
  const scoreColor =
    business.healthScore >= 80
      ? 'text-green-400'
      : business.healthScore >= 60
      ? 'text-yellow-400'
      : 'text-red-400';

  const statusText =
    business.healthScore >= 80
      ? 'Strong presence'
      : business.healthScore >= 60
      ? 'Solid presence with room to grow'
      : 'Needs improvement';

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">{business.name}</h2>
          <p className="text-blue-400 mt-1">{business.type}</p>
          <p className="text-gray-400 text-sm mt-1">{business.address}</p>
        </div>
        <div className="text-right">
          <div className={`text-4xl font-bold ${scoreColor}`}>
            {business.healthScore}
          </div>
          <div className="text-xs text-gray-400">Health Score</div>
          <div className={`text-xs mt-1 ${scoreColor}`}>{statusText}</div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StatBox label="Rating" value={`⭐ ${business.rating}`} sub={`${business.reviewCount} reviews`} />
        <StatBox label="Photos" value={business.photoCount} sub="indexed" />
        <StatBox label="Response Rate" value={`${business.responseRate}%`} sub="last 90 days" />
        <StatBox label="Recent Reviews" value={business.recentReviews} sub="past 30 days" />
      </div>

      {/* Contact Info */}
      <div className="flex gap-4 mt-5 flex-wrap text-sm">
        {business.website && (
          <a
            href={business.website}
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 hover:underline"
          >
            🌐 {business.website}
          </a>
        )}
        {business.phone && (
          <span className="text-gray-300">📞 {business.phone}</span>
        )}
        {!business.hasHours && (
          <span className="text-yellow-400">⚠️ No business hours set</span>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value, sub }) {
  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
      <div className="text-xs text-gray-500">{sub}</div>
    </div>
  );
}