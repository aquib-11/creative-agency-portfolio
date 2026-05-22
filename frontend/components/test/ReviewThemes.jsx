export default function ReviewThemes({ themes }) {
  if (!themes || themes.length === 0) return null;
  const max = themes[0].count || 1;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="font-bold text-lg mb-4">Review Themes</h3>
      <div className="space-y-3">
        {themes.map(({ word, count }) => (
          <div key={word} className="flex items-center gap-3">
            <span className="text-sm w-28 capitalize text-gray-300 truncate">{word}</span>
            <div className="flex-1 bg-gray-800 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-400 w-5 text-right">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}