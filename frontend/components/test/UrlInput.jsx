import { useState } from 'react';

export default function UrlInput({ onAnalyze, loading }) {
  const [url, setUrl] = useState('');

  const handleSubmit = () => {
    if (url.trim()) onAnalyze(url.trim());
  };

  return (
    <div className="flex gap-3">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="Paste your Google Maps URL here..."
        className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
      />
      <button
        onClick={handleSubmit}
        disabled={loading || !url.trim()}
        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 rounded-xl font-semibold transition-colors whitespace-nowrap"
      >
        {loading ? 'Analyzing...' : 'Analyze →'}
      </button>
    </div>
  );
}