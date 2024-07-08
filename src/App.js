import "./App.css";
import { ArcwareInit } from "@arcware-cloud/pixelstreaming-websdk";
import React, { useState, useRef, useEffect } from "react";

function App() {
  const videoContainerRef = useRef(null);
  const [arcwareApplication, setArcwareApplication] = useState(null);
  const [applicationResponse, setApplicationResponse] = useState("");
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    // Parse message from the URL
    const url = window.location.href;
    const message = url.split('/').pop(); // Extracts 'Test9990' from the URL
    setMessage(message);

    // Fetch data from endpoint if message exists
    if (message) {
      fetch(`https://mint.infinityvoid.io/pixelStripeApi/projects/shareId/${message}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Project not found');
          }
          return response.json();
        })
        .then(data => {
          // Check status and subscriptionEndDate

        
          if (data.status === 'true') {
            console.log(data);
            setStatus('active');
          } else {
            setStatus('inactive');
          }
        })
        .catch(error => {
          console.error('Error fetching project:', error);
          setStatus('notfound');
        });
    } else {
      // Handle invalid URL scenario
      setStatus('invalidurl');
    }
  }, [message]);

  useEffect(() => {
    if (message !== null && status === 'active') {
      const { Application } = ArcwareInit({
        shareId: message
      }, {
        initialSettings: {
          StartVideoMuted: true,
          AutoConnect: true,
          AutoPlayVideo: true
        },
        settings: {
          infoButton: true,
          micButton: true,
          audioButton: true,
          fullscreenButton: true,
          settingsButton: true,
          connectionStrengthIcon: true
        },
      });

      setArcwareApplication(Application);
      Application.getApplicationResponse((response) =>
        setApplicationResponse(response)
      );

      // Append the application's root element to the video container ref
      if (videoContainerRef.current) {
        videoContainerRef.current.innerHTML = ''; // Clear previous content if any
        videoContainerRef.current.appendChild(Application.rootElement);
      }
    }
  }, [message, status]);

  let uiContent;

  if (status === 'inactive') {
    uiContent = (
      <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p>Not Allowed</p>
      </div>
    );
  } else if (status === 'notfound' || status === 'invalidurl') {
    uiContent = (
      <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p>Not Valid URL</p>
      </div>
    );
  } else {
    uiContent = (
      <div ref={videoContainerRef} style={{ width: "100vw", height: "100vh" }} />
    );
  }

  return (
    <div>
      {uiContent}
    </div>
  );
}

export default App;
