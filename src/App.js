import './App.css';
import {useRef, useEffect, useState} from 'react';
import { WebRTCClient } from "@arcware/webrtc-plugin"
import React from 'react';
var isMobile = require('detect-touch-device');


console.log(isMobile.isMobile);

let message;
var a = window.location.search;
var b = a.split("?");
if(b.length>1){
 
  var c = b[1].split("&");
  message = c[0];
}


function AppUI (props) {
  const { emitUIInteraction } = props;


  function playButton (event) {

    document.body.requestPointerLock();

    let touchDescriptor;


    if(isMobile.isMobile == true){
      touchDescriptor = {
       Istouch: 'True'
     };
   }else{
     touchDescriptor = {
       Istouch: 'False'
     };
   }

   emitUIInteraction(touchDescriptor);

    let consoleDescriptor = {
      Console: message
    };

  
    emitUIInteraction(consoleDescriptor);

  }
  
  return (<div className="buttons-block">
            <button on onClick={()=>playButton()}>Play</button>
          </div>);
}




function App() {
  const sizeContainerRef = useRef(null);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [webrtcClient, setWebrtcClient] = useState();
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [videoDelay, setVideoDelay] = useState(true)
  const [paragraphIndex, setParagraphIndex] = useState(0)
  const [loading, setLoading] = useState(false);
  const [contentStyle, setContentStyle] = useState();
  const [buttonText, setButtonText] = useState("Play");
  const [playerStyle, setPlayerStyle] = useState({display:"none"});


  let webrtcClientInit = false;


  const responseCallback = (message) => {
    var win = window.open(message, '_blank');

    if(win !==null){
      win.focus();
    }

  }

  const videoInitialized = () => {


    /*if (webrtcClient) {
      
      console.log(webrtcClient);

      let consoleDescriptor = {
        Console: message
      };
      webrtcClient.emitUIInteraction(consoleDescriptor);
      setLoading(false);
      
     // webrtcClient.emitUIInteraction(descriptors.color.black);
    }
    */
  }

  useEffect(() => {

    const args = {
      address: "wss://signalling-client.ragnarok.arcware.cloud/",
     shareId: 'share-dbb4f8fd-9f94-4220-af2d-02405f8a32fa',
      settings: {},
      sizeContainer: sizeContainerRef.current,
      container: containerRef.current,
      videoRef: videoRef.current,
      forceVideoToFitContainer: true,
      playOverlay: false,
      loader: () => {},
      applicationResponse: responseCallback,
      videoInitializeCallback: videoInitialized
    };

    if (!webrtcClientInit) {
       webrtcClientInit = true;
       setWebrtcClient(new WebRTCClient(args));
        
    }
    
    
  }, [])

  

  const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );


  const startPlay =async()=>{
    setButtonText("Loading");
      setLoading(true);
  
    await delay(6000).then(()=>{
      console.log("calling");
 
    });
    
  }

  return (
    <>



<div className="App">
      <div ref={sizeContainerRef}>
        <div ref={containerRef} style={{ zIndex: 1 }}>
          <video ref={videoRef} />
          {webrtcClient != null && <AppUI emitUIInteraction={webrtcClient.emitUIInteraction} />}
         
        </div>
      </div>
    </div>
      

  
    </>
  );
}

export default App;
