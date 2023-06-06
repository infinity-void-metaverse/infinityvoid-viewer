import React, { useRef, useEffect, useState } from 'react';
import { WebRTCClient } from '@arcware/webrtc-plugin';
import { BsFullscreen, BsFullscreenExit, BsFillVolumeMuteFill, BsFillVolumeUpFill } from "react-icons/bs";
import { Container, Row } from 'reactstrap';


var isMobile = require('detect-touch-device');
let playListVideo =["https://development-test.fra1.cdn.digitaloceanspaces.com/1.mp4","https://development-test.fra1.cdn.digitaloceanspaces.com/2.mp4","https://development-test.fra1.cdn.digitaloceanspaces.com/3.mp4"];

let message;
var a = window.location.search;
var b = a.split("?");
if(b.length>1){
 
  var c = b[1].split("&");
  message = c[0];
}

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


  const toggleYes =()=>{
    var elem  = document.documentElement; 
  
		setIsFullScreen(!isFullScreen);


 if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitEnterFullScreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }

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
 

    console.log(data);

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
	   
		    await delay(8000).then(async()=>{


         
					 data.emitUIInteraction(consoleDescriptor);
				   data.emitUIInteraction(touchDescriptor);

           await delay(2200).then(()=> {setLoading(false);});
       

				
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

 <Container fluid style={{ position:"fixed",top:"0",left:"0",right:"0",bottom:"0"}}> 
 <div style={{ position:"fixed",zIndex:"110",marginLeft:"60px"}}>
 <img src = "./infilogo.png" width="100px" /> 
 </div >
 {loading == true ?(<>
  <Row style={{position:"fixed",top:"0",left:"0",right:"0",bottom:"0",zIndex:"100"}}>
  <video ref={videoPlayRef} src={videoPlay}  loop muted autoPlay  type="video/mp4"  />

  </Row>
</>):(null)}



<Row >
<div ref={sizeContainerRef} >


    <div ref={videoContainerRef} >
    <video id="myVideo" autoPlay ref={videoRef} />
    <audio  id="myAudio" autoPlay ref={audioRef} />


<button onClick={toggleMute} style={{zIndex:100, height:"40px",position:"fixed",bottom:"25px", backgroundColor:"#0a0519", border:"2px solid #0a0519", right:"120px"}}>{isMuted ? <BsFillVolumeMuteFill size={32} color='26F8FF'/> : <BsFillVolumeUpFill size={24} color='26F8FF'/>}</button>

<button onClick={()=>screenSize()} style={{zIndex:100, height:"40px",position:"fixed",bottom:"25px", backgroundColor:"#0a0519", border:"2px solid #0a0519", right:"60px"}}>{isFullScreen ? <BsFullscreenExit size={32} color='26F8FF'/> : <BsFullscreen size={24} color='26F8FF'/>}</button>

</div>
 
      
      
      
      </div>
		
      </Row>
     
  

  </Container>
	</>
  );
};

export default App;
