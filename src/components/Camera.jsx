import React, { useRef, useState, useEffect } from "react";

const FullScreenCamera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);

  // Start camera stream
  useEffect(() => {
    let stream = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setHasPermission(true);
        }
      } catch (err) {
        console.error("Camera error:", err);
        setHasPermission(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    if (!hasPermission || !videoRef.current) return;

    setIsCapturing(true);

    // Use canvas to capture frame
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    setImage(canvas.toDataURL("image/jpeg"));
    setShowCheckmark(true);

    setTimeout(() => {
      setIsCapturing(false);
      setShowCheckmark(false);
    }, 1000);
  };

  const retakePhoto = () => {
    setImage(null);
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* Camera Preview */}
      {hasPermission ? (
        image ? (
          <img
            src={image}
            alt="Captured"
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            playsInline
            muted
            autoPlay
          />
        )
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-white p-8 text-center">
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
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p>Camera permission required. Please refresh and allow access.</p>
        </div>
      )}

      {/* Hidden canvas for capturing */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Capture/Retake Button */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        {image ? (
          <button
            onClick={retakePhoto}
            className="bg-white rounded-full p-4 shadow-lg flex items-center justify-center"
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
            onClick={capturePhoto}
            disabled={!hasPermission || isCapturing}
            className={`relative h-16 w-16 rounded-full border-4 border-white ${
              hasPermission ? "bg-red-500" : "bg-gray-500"
            } shadow-lg`}
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

      {/* Flash effect */}
      {isCapturing && (
        <div className="absolute inset-0 bg-white opacity-75 animate-pulse"></div>
      )}
    </div>
  );
};

export default FullScreenCamera;
