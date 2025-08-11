import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import {
  FaCamera,
  FaRedo,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";

const FullScreenCameraApp = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [flashEffect, setFlashEffect] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const capture = () => {
    if (!webcamRef.current) return;

    // Visual feedback
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
    // Implement your save logic here
    console.log("Photo saved:", imgSrc);
    alert("Photo saved!");
  };

  const handleError = () => {
    setPermissionError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setPermissionError(false);
    setIsLoading(false);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Flash Effect */}
      {flashEffect && (
        <div className="absolute inset-0 bg-white animate-flash"></div>
      )}

      {/* Loading State */}
      {isLoading && !permissionError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-blue-600 rounded-full mb-4"></div>
            <p className="text-white">Loading camera...</p>
          </div>
        </div>
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
          forceScreenshotSourceSize={true}
        />
      )}

      {/* Error Message */}
      {permissionError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90 text-white p-4 text-center">
          <div className="bg-red-500 rounded-full p-4 mb-4">
            <FaExclamationTriangle className="text-2xl" />
          </div>
          <h2 className="text-xl font-bold mb-2">Camera Permission Required</h2>
          <p className="mb-6 text-gray-300">
            Please allow camera access in your browser settings to use this
            feature
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-medium transition-colors"
          >
            Reload & Allow Access
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        {imgSrc ? (
          <div className="flex gap-8 bg-black bg-opacity-40 backdrop-blur-md rounded-full px-6 py-3">
            {/* Retake Button */}
            <button
              onClick={retake}
              className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full px-6 py-3 transition-all"
              aria-label="Retake photo"
            >
              <FaRedo className="text-white text-xl" />
              <span className="text-white font-medium">Retake</span>
            </button>

            {/* Save Button */}
            <button
              onClick={savePhoto}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 rounded-full px-6 py-3 transition-all"
              aria-label="Save photo"
            >
              <FaCheck className="text-white text-xl" />
              <span className="text-white font-medium">Save</span>
            </button>
          </div>
        ) : (
          <button
            onClick={capture}
            disabled={permissionError || isLoading}
            className={`relative h-16 w-16 rounded-full border-4 border-white ${
              permissionError ? "bg-gray-500" : "bg-red-500 hover:bg-red-600"
            } shadow-xl transition-all flex items-center justify-center`}
            aria-label="Take photo"
          >
            <FaCamera className="text-white text-2xl" />
          </button>
        )}
      </div>

      {/* Status Bar (for demo purposes) */}
      <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-center text-sm">
        {imgSrc
          ? "Preview Mode"
          : permissionError
          ? "Camera Blocked"
          : "Camera Ready"}
      </div>

      {/* Flash animation style */}
      <style jsx global>{`
        @keyframes flash {
          0% {
            opacity: 0.9;
          }
          70% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
          }
        }
        .animate-flash {
          animation: flash 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FullScreenCameraApp;
