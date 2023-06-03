import React, { useRef, useEffect, useState } from 'react';
import { WebRTCClient } from '@arcware/webrtc-plugin';
import { BsFullscreen, BsFullscreenExit, BsFillVolumeMuteFill, BsFillVolumeUpFill } from "react-icons/bs";
var isMobile = require('detect-touch-device');


let message;
var a = window.location.search;
var b = a.split("?");
if(b.length>1){
 
  var c = b[1].split("&");
  message = c[0];
}


function App() {
  const sizeContainerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [webRTCclient, setWebRTCclient] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isFull, setIsFull] = useState(false);

  const sendSocketMessage = async(messageSoc) => {

   console.log(messageSoc);
  }


  const responseCallback = (message) => {
    var win = window.open(message, '_blank');

    if(win !==null){
      win.focus();
    }

  }
 const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );
  
  const videoInitialized = async(data) => {
 
       let consoleDescriptor = {
          MessageId: message
        };
		
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
	   
		    await delay(8000).then(()=>{
				
					 data.emitUIInteraction(consoleDescriptor);
				     data.emitUIInteraction(touchDescriptor);
			})
		 

 }
 
 
 useEffect(() => {
  function onFullscreenChange() {
    setIsFull(Boolean(document.pixelPlay));
  }
        
  document.addEventListener('fullscreenchange', onFullscreenChange);

  return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
}, []);

  
  useEffect(() => {
    const newWebRTC = new WebRTCClient ({
      address: 'wss://signalling-client.ragnarok.arcware.cloud/',
      shareId: 'share-330e9620-1a46-4a19-9c58-004f4d1869fe',
      settings: { /* object with settings */ },
      playOverlay: false,
      loader: (val) => { /* handle loader */ },
      sizeContainer: sizeContainerRef.current,
      container: videoContainerRef.current,
      videoRef: videoRef.current,
      audioRef: audioRef.current,
	  applicationResponse: responseCallback,
	  videoInitializeCallback:(data)=> videoInitialized(data),
      sendLetter:(messageSoc)=>sendSocketMessage(messageSoc)
    });
	
  setWebRTCclient(newWebRTC);
	
  }, []);
  
    const toggleMute = () => {
		var x = document.getElementById("myAudio");
		
    setIsMuted(!isMuted);
	x.play();
	 x.muted = !isMuted;
	console.log(audioRef.current.muted);
    audioRef.current.muted = !isMuted;
  };
  
    const screenSize = (id) => {
		
		console.log(id);
    var element = document.getElementById(id);       
	console.log(element);
	
	if(element !== null){
  if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  }  
	}
  };



  return (
 
 
<div id = "pixelPlay" ref={sizeContainerRef}>
	<button onClick={toggleMute} style={{zIndex:100, position:"fixed",bottom:"10px", backgroundColor:"transparent", border:"0px", borderColor:"transparent", right:"60px"}}>{isMuted ? <BsFillVolumeMuteFill size={24}/> : <BsFillVolumeUpFill size={24}/>}</button>
	
 <button onClick={()=>screenSize("streamingVideoContainer")} style={{zIndex:100, position:"fixed",bottom:"10px", backgroundColor:"transparent", border:"0px", borderColor:"transparent", right:"20px"}}>{isFull ? <BsFullscreenExit size={24}/> : <BsFullscreen size={24}/>}</button>

      <div ref={videoContainerRef}>
        <video ref={videoRef} />
        <audio id="myAudio" ref={audioRef} />
      </div>
    </div>
	
  );
};

export default App;
