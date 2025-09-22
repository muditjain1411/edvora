import React, { useState } from 'react';

export default function NotesCard({ title, description, pdfUrl, givenBy, id }) {
  const [pdfLoadError, setPdfLoadError] = useState(false);

  // Use Google Docs Viewer for view-only embed in new tab (no easy download)
  const USE_GOOGLE_VIEWER = true;
  const viewerUrl = pdfUrl
    ? (USE_GOOGLE_VIEWER
      ? `https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`
      : pdfUrl)
    : null;

  const fullViewUrl = pdfUrl
    ? (USE_GOOGLE_VIEWER
      ? `https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`
      : pdfUrl)
    : null;

  const handleIframeError = () => {
    setPdfLoadError(true);
  };

  const handlePreviewClick = (e) => {
    e.preventDefault();
    if (fullViewUrl) {
      window.open(fullViewUrl, '_blank', 'noopener,noreferrer');  // Open in new tab, secure
    }
  };

  return (
    <div className="border-2 border-neutral-700 rounded-xl shadow-md overflow-hidden text-white bg-neutral-800 hover:shadow-lg transition-shadow cursor-pointer"  // Added cursor-pointer for click hint
      onClick={handlePreviewClick}  // Make whole card clickable to open full view
    >
      {/* PDF Preview Section - Click to open full in new tab */}
      <div className="h-48 relative bg-gray-700 flex items-center justify-center">
        {pdfUrl && !pdfLoadError ? (
          <iframe
            src={viewerUrl}
            className="w-full h-full border-none hover:opacity-90 overflow-hidden transition"  // Hover effect for interactivity
            title={`${title} PDF Preview`}
            onError={handleIframeError}
            sandbox="allow-same-origin allow-popups allow-scripts"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 p-4">
            {pdfUrl ? (
              <p className="text-sm mb-2">Preview unavailable - Click to view</p>
            ) : (
              <p className="text-sm mb-2">No PDF attached</p>
            )}
          </div>
        )}
        {/* View button (optional, since card is clickable) */}
        {pdfUrl && (
          <button
            onClick={(e) => {
              e.stopPropagation();  // Prevent card click
              window.open(fullViewUrl, '_blank', 'noopener,noreferrer');
            }}
            className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition z-10"
            aria-label="View full PDF in new tab"
          >
            👁️ View Full
          </button>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 truncate">{title}</h2>
        <p className="text-sm mb-3 line-clamp-3 text-gray-200">{description}</p>
        <p className="text-xs text-gray-400">
          Given by: <span className="font-medium">{givenBy || 'Unknown'}</span>
        </p>
        
      </div>
    </div>
  );
}