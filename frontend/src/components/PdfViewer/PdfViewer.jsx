import { useState } from "react";

function PdfViewer({ url, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg overflow-hidden w-11/12 md:w-3/4 h-4/5 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-gray-100 border-b">
          <h2 className="font-bold text-lg">PDF Viewer</h2>
          <div className="flex gap-2">
            <a
              href={url}
              download
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              Download
            </a>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Close
            </button>
          </div>
        </div>

        {/* PDF Body */}
        <div className="flex-1 overflow-auto">
          <iframe
            src={url}
            className="w-full h-full"
            title="PDF Viewer"
            frameBorder="0"
          />
        </div>
      </div>
    </div>
  );
}

export default PdfViewer;
