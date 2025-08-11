import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";

const ProfessionalCameraCapture = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");
  const [flash, setFlash] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState(null);
  const [permission, setPermission] = useState("prompt");
  const [showPermissionRequest, setShowPermissionRequest] = useState(false);

  // Video constraints
  const videoConstraints = {
    facingMode: facingMode,
    width: { ideal: 1920 },
    height: { ideal: 1080 },
  };

  // Check camera permission status
  const checkPermission = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasPermission = devices.some(
        (device) => device.kind === "videoinput" && device.label
      );
      return hasPermission;
    } catch (err) {
      console.error("Permission check error:", err);
      return false;
    }
  };

  // Initialize camera with permission check
  useEffect(() => {
    const initCamera = async () => {
      const hasPermission = await checkPermission();
      if (!hasPermission) {
        setShowPermissionRequest(true);
        setPermission("prompt");
      } else {
        setPermission("granted");
      }
    };
    initCamera();
  }, []);

  // Explicitly request camera access
  const requestCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (stream) {
        setPermission("granted");
        setShowPermissionRequest(false);
        // Assign stream to webcam if ref exists
        if (webcamRef.current) {
          webcamRef.current.video.srcObject = stream;
        }
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Could not access camera. Please grant permission.");
      setPermission("denied");
    }
  };

  const capture = () => {
    if (permission !== "granted") {
      setError("Camera permission not granted");
      return;
    }

    setIsCapturing(true);
    setFlash(true);

    setTimeout(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
      setFlash(false);
      setIsCapturing(false);
    }, 200);
  };

  const retake = () => {
    setImgSrc(null);
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Permission Request Banner */}
        {showPermissionRequest && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
            <div className="flex justify-between items-center">
              <p className="text-yellow-700">
                Camera access is required to use this feature
              </p>
              <button
                onClick={requestCameraAccess}
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Allow Camera
              </button>
            </div>
          </div>
        )}

        {/* Camera Header */}
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Camera</h1>
          {permission === "granted" && (
            <div className="flex space-x-2">
              <button
                onClick={toggleCamera}
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                title="Switch Camera"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
              </button>
              <button
                onClick={() => setFlash(!flash)}
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                title={flash ? "Flash On" : "Flash Off"}
              >
                {flash ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Camera Preview */}
        <div className="relative bg-black">
          {permission === "denied" ? (
            <div className="flex flex-col items-center justify-center h-64 text-white p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-center">
                Camera permission denied. Please enable camera access in your
                browser settings.
              </p>
            </div>
          ) : imgSrc ? (
            <img
              src={imgSrc}
              alt="Captured"
              className="w-full aspect-square object-cover"
            />
          ) : permission === "granted" ? (
            <>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="w-full aspect-square object-cover"
              />
              {flash && (
                <div className="absolute inset-0 bg-white opacity-75 animate-ping"></div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-center">Camera access is required</p>
            </div>
          )}
        </div>

        {/* Camera Controls */}
        <div className="p-4 flex flex-col items-center">
          {imgSrc ? (
            <div className="flex space-x-4">
              <button
                onClick={retake}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-full font-medium transition-colors"
              >
                Retake
              </button>
              <button
                onClick={() => console.log("Save photo:", imgSrc)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors"
              >
                Save Photo
              </button>
            </div>
          ) : permission === "granted" ? (
            <button
              onClick={capture}
              disabled={isCapturing}
              className={`relative w-16 h-16 rounded-full border-4 border-white ${
                isCapturing ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
              } transition-colors shadow-lg`}
            >
              {isCapturing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          ) : null}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded max-w-md">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default ProfessionalCameraCapture;
