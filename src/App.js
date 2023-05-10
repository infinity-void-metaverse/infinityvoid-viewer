import * as React from 'react'
import { useEffect,useState, useRef } from 'react';
import { InfinitySpin, ThreeDots, Bars  } from  'react-loader-spinner'
import { WebRTCClient } from "@arcware/webrtc-plugin"

var isMobile = require('detect-touch-device');


let message;
var a = window.location.search;
var b = a.split("?");
if(b.length>1){
 
  var c = b[1].split("&");
  message = c[0];
}

function App() {
  const started = React.useRef(false)
  const [playerStyle, setPlayerStyle] = useState({display:"none"});
  const [contentStyle, setContentStyle] = useState({display:"none"});
  const [buttonText, setButtonText] = useState("Play");
  const [loading, setLoading] = useState(false);
  const [loadingStart, setLoadingStart] = useState(true);


  const sizeContainerRef = useRef(null);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [webrtcClient, setWebrtcClient] = useState();

  let webrtcClientInit = false;


  const responseCallback = (message) => {
    var win = window.open(message, '_blank');

    if(win !==null){
      win.focus();
    }

  }

  const sendSocketMessage = async(messageSoc) => {

    if (messageSoc == "Start connection to stream signalling."){

        await delay(3000).then(()=>{
          
            setContentStyle({display:'block'});
            setLoadingStart(false);

        })
     
    }
    

  }
  const videoInitialized = async() => {
   
  }

  useEffect(() => {

    const args = {
        address: "wss://signalling-client.ragnarok.arcware.cloud/",
        shareId: 'share-330e9620-1a46-4a19-9c58-004f4d1869fe',
        packageId:"a5875bd0-813f-4947-a847-a1fc7522ac28",
        settings: {},
        sizeContainer: sizeContainerRef.current,
        container: containerRef.current,
        videoRef: videoRef.current,
        audioRef: audioRef.current,
        forceVideoToFitContainer: true,
        playOverlay: false,
        loader: () => {},
        applicationResponse: responseCallback,
        videoInitializeCallback: videoInitialized,
        sendLetter:(messageSoc)=>sendSocketMessage(messageSoc)
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
    
      if(webrtcClient != null){
        setPlayerStyle({height:"100vh",display:"flex",top:'0',bottom:'0', cursor: 'none'});

        setLoading(false);
        setContentStyle({display:"none"});

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
    
       webrtcClient.emitUIInteraction(touchDescriptor);
  
        let consoleDescriptor = {
          MessageId: message
        };
    
        console.log(consoleDescriptor);
      
        webrtcClient.emitUIInteraction(consoleDescriptor);

      }
     

    
    });
    
  }


  return (
    <>
{loadingStart == true ?(<>
  <img className='header'  src = "./logoNew.png" /> 
  
  <Bars
  height="80"
  width="80"
  color="#26F8FF"
  ariaLabel="bars-loading"
  wrapperStyle={{justifyContent: "space-around", marginTop:"20%"}}
  wrapperClass=""
  visible={loadingStart}
/>


</>):(null)}



<img className='header' style={contentStyle} src = "./logoNew.png" /> 

<div className='content' style={contentStyle}>

<div className="wrapperButoon" >
  <button className="cta" onClick={()=>startPlay()}>
    <span>{buttonText}</span>
    <span>
      <svg width="66px" height="43px" viewBox="0 0 66 43" version="1.1">
        <g id="arrow" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <path className="one" d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z" fill="#0a0519"></path>
          <path className="two" d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z" fill="#0a0519"></path>
          <path className="three" d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z" fill="#0a0519"></path>
        </g>
      </svg>
    </span> 
  </button>
</div>

<ThreeDots 
height="180" 
width="180" 
radius="9"
color="#26F8FF" 
ariaLabel="loading"
wrapperStyle={{justifyContent: "space-around"}}
wrapperClassName=""
visible={loading}
 />
  
  </div> 

  <div style={playerStyle}>

  <div ref={sizeContainerRef} >
        <div ref={containerRef} style={{ zIndex: 1 }}>
          <video ref={videoRef} />
          <audio ref={audioRef} />
        </div>
      </div>
</div>
 
   
    
      </>
  );
}


export default App;
