import React, { useRef, useEffect, useState } from 'react';
import { WebRTCClient } from '@arcware/webrtc-plugin';
import {GoUnmute, GoMute, GoScreenFull, GoScreenNormal} from "react-icons/go";



var isMobile = require('detect-touch-device');
let playListVideo =["https://development-test.fra1.cdn.digitaloceanspaces.com/3.mp4","https://development-test.fra1.cdn.digitaloceanspaces.com/3.mp4","https://development-test.fra1.cdn.digitaloceanspaces.com/3.mp4"];

let message;
var a = window.location.search;
var b = a.split("?");
if(b.length>1){
 
 
  message = b[1];

}
let myScreenOrientation = window.screen.orientation;
console.log(myScreenOrientation);
console.log(isMobile.isMobile);

function App() {
  const sizeContainerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);
  const videoPlayRef = useRef(null);
  const audioRef = useRef(null);
  const [webRTCclient, setWebRTCclient] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoPlay, setVideoPlay] = useState();

  const sendSocketMessage = async(messageSoc) => {

   console.log(messageSoc);
  }




  
  const responseCallback = (message) => {

    if(message !== "closeUi" ){
      var win = window.open(message, '_blank');

      if(win !==null){
        win.focus();
      }
    }
   

  }
 const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );



useEffect(()=>{
var prevVideo = localStorage.getItem("preVideoPlay");
playListVideo.filter(e=> e!== prevVideo);
var item = playListVideo[Math.floor(Math.random()*playListVideo.length)];
localStorage.setItem("preVideoPlay", item);

setVideoPlay(item);
},[])

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
 

    var c = message.split("&");
    var sceneId = c[0].split("=")[1];
    var userId = c[1].split("=")[1];

    console.log(sceneId);
    console.log(userId);

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

    var obj={Istouch:touchDescriptor.Istouch,userId:userId,projectType:"userGame",networkIp:"singlePlayer",sceneId:sceneId}
    var ele = JSON.stringify(obj);


       let consoleDescriptor = {
          MessageId: ele
        };
		
	   
		    await delay(8000).then(async()=>{


         
					 data.emitUIInteraction(consoleDescriptor);


           await delay(2200).then(()=> {setLoading(false);});
       

				
			})
		 

 }
 

  
useEffect(() => {
  const newWebRTC = new WebRTCClient ({
    address: 'wss://signalling-client.ragnarok.arcware.cloud/',
    shareId: 'share-3235a6a6-64b4-468f-8724-9c4bb2eea500',
    settings: { /* object with settings */ },
    playOverlay: true,
    loader: (val) => { /* handle loader */ },
    sizeContainer: sizeContainerRef.current,
    container: videoContainerRef.current,
    videoRef: videoRef.current,
    audioRef: audioRef.current,
  applicationResponse: responseCallback,
  videoInitializeCallback:(data)=> videoInitialized(data),
    sendLetter:(messageSoc)=>sendSocketMessage(messageSoc),
  });

setWebRTCclient(newWebRTC);




}, []);



  
    const toggleMute = () => {
		var x = document.getElementById("myAudio");
		
    setIsMuted(!isMuted);

	 x.muted = !isMuted;

	
    audioRef.current.muted = !isMuted;
  };
  
    const screenSize = () => {
		

    var elem  = document.getElementById("interactive-video");       
	
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

<div style={{ position:"fixed",zIndex:"110",left:"20px"}}>
 <img src = "./infilogo.png" width="100px" /> 
 </div >

<div className="app_app__9OAH2">


      <div style={{height: '100%', width: '100%', background: 'black', flex: '1 1 auto', display: 'flex',
         alignItems: 'center', flexDirection: 'column'}}>

{loading == true ?(<>
  <video ref={videoPlayRef} src={videoPlay}  loop muted autoPlay  type="video/mp4"  />

  
</>):(null)}


     <audio id="myAudio" ref={audioRef} />
        <div ref={sizeContainerRef} id="interactive-video" className="InteractiveVideo_interactive-video__Ej1qP"
         style={{display: 'flex', justifyContent: 'center', alignItems: 'center', maxHeight: '100%', maxWidth: '100%', height: '100%', 
         position: 'relative', top: 'auto', background: 'none'}}>
  <div ref={videoContainerRef} className="css-1ujh55s"style={{display: 'flex', height: 'auto', width: '100%', position: 'relative'}}>
          <video  ref={videoRef} />
          <div className="css-fe8aaf">
              
<button onClick={toggleMute}  className='btnVolume'>{isMuted ? <GoMute size={16} color='#F8F6F4' /> : <GoUnmute color='#F8F6F4' size={16} />}</button>

<button onClick={()=>screenSize()} className='btnFullScreen'>{isFullScreen ? <GoScreenNormal size={16} color='#F8F6F4'  /> : <GoScreenFull size={16} color='#F8F6F4'/>}</button>

            </div>

          </div>
          
          </div>
          
          </div>
          
          </div>




	</>
  );
};

export default App;
