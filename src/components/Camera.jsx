import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const ResponsiveCamera = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [flashEffect, setFlashEffect] = useState(false);
  const [permissionError, setPermissionError] = useState(false);

  const capture = () => {
    if (!webcamRef.current) return;

    setFlashEffect(true);
    setTimeout(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
      setFlashEffect(false);
    }, 200);
  };

  const retake = () => {
    setImgSrc(null);
  };

  const savePhoto = () => {
    // Add your save logic here
    console.log("Photo saved:", imgSrc);
  };

  const handleError = () => {
    setPermissionError(true);
  };

  const handleLoad = () => {
    setPermissionError(false);
  };

  return (
    <div className="relative w-full aspect-[4/3] bg-gray-900 overflow-hidden max-h-screen">
      {/* Flash Effect */}
      {flashEffect && (
        <div className="absolute inset-0 bg-white animate-flash"></div>
      )}

      {/* Camera Preview */}
      {imgSrc ? (
        <img
          src={imgSrc}
          alt="Captured"
          className="w-full h-full object-cover"
        />
      ) : (
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          }}
          className="w-full h-full object-cover"
          onUserMediaError={handleError}
          onUserMedia={handleLoad}
        />
      )}

      {/* Error Message */}
      {permissionError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90 text-white p-4 text-center">
          <div className="bg-red-500 rounded-full p-3 mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
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
          </div>
          <h2 className="text-xl font-bold mb-2">Camera Access Required</h2>
          <p className="mb-4 text-gray-300 text-sm">
            Please enable camera permissions in your browser settings
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-sm"
          >
            Reload & Allow
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        {imgSrc ? (
          <div className="flex space-x-4 bg-black bg-opacity-40 backdrop-blur-sm rounded-full p-2">
            {/* Retake Button - Now properly visible */}
            <button
              onClick={retake}
              className="flex items-center justify-center bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all"
              aria-label="Retake photo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
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

            {/* Save/Confirm Button */}
            <button
              onClick={savePhoto}
              className="flex items-center justify-center bg-green-500 hover:bg-green-600 rounded-full p-3 transition-all"
              aria-label="Save photo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
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
            </button>
          </div>
        ) : (
          <button
            onClick={capture}
            disabled={permissionError}
            className={`relative h-14 w-14 rounded-full border-4 border-white ${
              permissionError ? "bg-gray-500" : "bg-red-500 hover:bg-red-600"
            } shadow-lg transition-all`}
            aria-label="Take photo"
          >
            <span className="sr-only">Capture photo</span>
          </button>
        )}
      </div>

      {/* Add custom animations to Tailwind config */}
      <style jsx global>{`
        @keyframes flash {
          0% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
          }
        }
        .animate-flash {
          animation: flash 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ResponsiveCamera;
