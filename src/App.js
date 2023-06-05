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
  const [isFullScreen, setIsFullScreen] = useState(false);

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





  useEffect(()=>{
   
    var audio = document.getElementById("myAudio");
 
      audio.addEventListener("canplaythrough", () => {
        audio.play().catch(e => {
           window.addEventListener('click', () => {
           
              audio.play()
           })
        })

         

     });
  },[audioRef])
  
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
    sendLetter:(messageSoc)=>sendSocketMessage(messageSoc),
  
  autoPlay:{
    audio:true,
    video:true
  }
  });

setWebRTCclient(newWebRTC);

}, []);


  
    const toggleMute = () => {
		var x = document.getElementById("myAudio");
		
    setIsMuted(!isMuted);

	 x.muted = !isMuted;

	
    audioRef.current.muted = !isMuted;
  };
  
    const screenSize = (id) => {
		

    var elem  = document.documentElement;       
	
		setIsFullScreen(!isFullScreen);
console.log(isFullScreen);

 if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitEnterFullScreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
 
	
			 if (document.fullscreenElement !== null) {
 if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
			 }
  };



  return (
 <>

<div className='container-fluid'  ref={sizeContainerRef} style={{height:"100vh", width:"100vw",top:'0',bottom:'0', position:"fixed", left:"0",right:"0" }}>
	
      <div id="pixelPlay" ref={videoContainerRef} >
         <video id="myVideo" autoplay ref={videoRef} />
        <audio  id="myAudio" autoPlay ref={audioRef} />
		

 <button onClick={toggleMute} style={{zIndex:100, position:"fixed",bottom:"10px", backgroundColor:"transparent", border:"0px", borderColor:"transparent", right:"50px"}}>{isMuted ? <BsFillVolumeMuteFill size={24}/> : <BsFillVolumeUpFill size={24}/>}</button>
	
 <button onClick={()=>screenSize("pixelPlay")} style={{zIndex:100, position:"fixed",bottom:"10px", backgroundColor:"transparent", border:"0px", borderColor:"transparent", right:"25px"}}>{isFullScreen ? <BsFullscreenExit size={24}/> : <BsFullscreen size={24}/>}</button>
 
      
		
      </div>
    </div>
  
	</>
  );
};

export default App;
