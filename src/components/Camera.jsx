import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const PremiumCamera = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [flashEffect, setFlashEffect] = useState(false);
  const [buttonPulse, setButtonPulse] = useState(false);
  const [permissionError, setPermissionError] = useState(false);

  const capture = () => {
    if (!webcamRef.current) return;

    // Visual feedback
    setButtonPulse(true);
    setFlashEffect(true);

    setTimeout(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
      setFlashEffect(false);
      setButtonPulse(false);
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
    <div className="relative h-screen w-full bg-gray-900 overflow-hidden">
      {/* Flash Effect */}
      {flashEffect && (
        <div className="absolute inset-0 bg-white animate-flash"></div>
      )}

      {/* Camera Preview */}
      {imgSrc ? (
        <img
          src={imgSrc}
          alt="Captured"
          className="h-full w-full object-cover transform transition-transform duration-300 hover:scale-105"
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
          className="h-full w-full object-cover"
          onUserMediaError={handleError}
          onUserMedia={handleLoad}
        />
      )}

      {/* Error Message */}
      {permissionError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90 text-white p-8 text-center">
          <div className="bg-red-500 rounded-full p-4 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
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
          <h2 className="text-2xl font-bold mb-2">Camera Access Required</h2>
          <p className="mb-6 text-gray-300">
            Please allow camera permissions in your browser settings
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-medium transition-all transform hover:scale-105"
          >
            Reload & Allow Access
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        {imgSrc ? (
          <div className="flex space-x-8">
            {/* Retake Button */}
            <button
              onClick={retake}
              className="flex items-center justify-center bg-white bg-opacity-20 backdrop-blur-lg rounded-full p-5 shadow-xl transform transition-all hover:scale-110 hover:bg-opacity-30"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
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
              className="flex items-center justify-center bg-green-500 rounded-full p-5 shadow-xl transform transition-all hover:scale-110 hover:bg-green-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
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
            className={`relative h-16 w-16 rounded-full border-4 border-white ${
              permissionError ? "bg-gray-500" : "bg-red-500 hover:bg-red-600"
            } shadow-2xl transition-all duration-300 ${
              buttonPulse ? "transform scale-125" : "hover:scale-110"
            }`}
          >
            <span className="absolute inset-0 flex items-center justify-center">
              {buttonPulse && (
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
              )}
            </span>
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

export default PremiumCamera;
