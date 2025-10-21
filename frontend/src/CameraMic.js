import React, { useRef, useEffect } from 'react';

const CameraMic = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing media devices.', err);
      }
    };

    getMedia();

    // Example of how to include the bearer token in an API request
    const token = localStorage.getItem('token');
    fetch('http://localhost:8000/api/camera-mic', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }, []);

  return (
    <div>
      <h2>Camera and Mic</h2>
      <video ref={videoRef} autoPlay playsInline muted />
    </div>
  );
};

export default CameraMic;
