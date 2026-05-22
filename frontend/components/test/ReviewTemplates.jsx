import { useState } from 'react';

export default function ReviewTemplates({ templates, businessName }) {
  const [copied, setCopied] = useState(null);

  const handleCopy = (text, i) => {
    navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!templates || templates.length === 0) return null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">📋</span>
        <h3 className="font-bold text-lg">AI Review Templates</h3>
      </div>
      <p className="text-gray-400 text-sm mb-5">
        Share these with your customers at {businessName}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template, i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-4 relative">
            <p className="text-sm text-gray-300 pr-16 leading-relaxed">{template}</p>
            <button
              onClick={() => handleCopy(template, i)}
              className="absolute top-3 right-3 text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-lg transition-colors"
            >
              {copied === i ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}