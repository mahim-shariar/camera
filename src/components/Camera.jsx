import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const FullScreenCamera = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [permissionError, setPermissionError] = useState(false);

  const capture = () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    setShowCheckmark(true);

    setTimeout(() => setShowCheckmark(false), 1000);
  };

  const retake = () => {
    setImgSrc(null);
  };

  const handleError = () => {
    setPermissionError(true);
  };

  const handleLoad = () => {
    setPermissionError(false);
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* Camera Preview */}
      {imgSrc ? (
        <img
          src={imgSrc}
          alt="Captured"
          className="h-full w-full object-cover"
        />
      ) : (
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "environment" }}
          className="h-full w-full object-cover"
          onUserMediaError={handleError}
          onUserMedia={handleLoad}
        />
      )}

      {/* Error Message */}
      {permissionError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-white p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-xl font-bold mb-2">Camera Blocked</h2>
          <p className="mb-4">Please allow camera access to use this feature</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 rounded-md"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Capture/Retake Button */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        {imgSrc ? (
          <button
            onClick={retake}
            className="bg-white rounded-full p-4 shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        ) : (
          <button
            onClick={capture}
            disabled={permissionError}
            className={`relative h-16 w-16 rounded-full border-4 border-white ${
              permissionError ? "bg-gray-500" : "bg-red-500 hover:bg-red-600"
            } shadow-lg transition-colors`}
          >
            {showCheckmark && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white animate-ping"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default FullScreenCamera;
