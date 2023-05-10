import React, { useRef, useEffect, useState } from 'react';
import { WebRTCClient } from '@arcware/webrtc-plugin';

function App() {
  const sizeContainerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [webRTCclient, setWebRTCclient] = useState(null);

  useEffect(() => {
    const newWebRTC = WebRTCClient ({
      address: 'wss://signalling-client.ragnarok.arcware.cloud/',
      shareId: 'share-330e9620-1a46-4a19-9c58-004f4d1869fe',
      settings: { /* object with settings */ },
      playOverlay: false,
      loader: (val) => { /* handle loader */ },
      applicationResponse: (response) => { /* handle application response */ },
      sizeContainer: sizeContainerRef.current,
      container: videoContainerRef.current,
      videoRef: videoRef.current,
      audioRef: audioRef.current
    });
    setWebRTCclient(newWebRTC);
  }, []);

  return (
    <div ref={sizeContainerRef}>
      <div ref={videoContainerRef}>
        <video ref={videoRef} />
        <audio ref={audioRef} />
      </div>
    </div>
  );
};

export default App;