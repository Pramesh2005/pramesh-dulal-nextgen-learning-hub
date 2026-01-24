import { useState, useEffect, useRef } from "react";

function PdfViewer({ url, onClose }) {
  const iframeRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Disable background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Zoom controls
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));
  const resetZoom = () => setScale(1);

  // Full / Half screen toggle
  const toggleFullScreen = () => setIsFullScreen((prev) => !prev);

  if (!url) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300"
        style={{
          width: isFullScreen ? "98vw" : "85vw",
          height: isFullScreen ? "98vh" : "80vh",
          minHeight: "400px",
        }}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 bg-gray-100 border-b">
          <h2 className="font-bold text-lg md:text-xl flex items-center gap-2">
            📄 PDF Viewer
          </h2>

          <div className="flex gap-2 items-center flex-wrap">
            {/* Zoom */}
            <div className="flex bg-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={zoomOut}
                className="px-3 py-1 hover:bg-gray-300"
              >
                ➖
              </button>
              <button
                onClick={resetZoom}
                className="px-3 py-1 hover:bg-gray-300"
              >
                100%
              </button>
              <button
                onClick={zoomIn}
                className="px-3 py-1 hover:bg-gray-300"
              >
                ➕
              </button>
            </div>

            {/* Full / Half Screen */}
            <button
              onClick={toggleFullScreen}
              className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              {isFullScreen ? "Half Screen" : "Full Screen"}
            </button>

            {/* OPEN / DOWNLOAD (NEW TAB) */}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Download
            </a>

            {/* Close */}
            <button
              onClick={onClose}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>

        {/* PDF BODY */}
        <div className="flex-1 bg-gray-50 overflow-auto">
          <iframe
            ref={iframeRef}
            src={url}
            title="PDF Viewer"
            frameBorder="0"
            className="w-full h-full"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default PdfViewer;
