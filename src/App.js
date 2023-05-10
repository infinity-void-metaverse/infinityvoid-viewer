import './App.css';
import {useRef, useEffect, useState} from 'react';
import { WebRTCClient } from "@arcware/webrtc-plugin"
import { InfinitySpin, ThreeDots  } from  'react-loader-spinner'


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
    console.log(event);
      let command = message
    let consoleDescriptor = {
      Console: command
    };
    emitUIInteraction(consoleDescriptor);
    
    
   
  }
  
  return (<div className="buttons-block">
            <button on onClick={()=>playButton()}>Play</button>
          </div>);
}


function Responses (props) {
  const {responses} = props;

  return (<div className="responses-block">
    <h4>Response log from UE app:</h4>
    <div className="responses-list">
      {responses.map(v => <p>{v}</p>)}
    </div>
  </div>)
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
    console.log('response')
const url = "https://infinityvoid.io/"+message;

    var win = window.open(url, '_blank');

    if(win !==null){
      win.focus();
    }
  


    setResponses([message, ...responses])
  }

  const videoInitialized = () => {

    if (webrtcClient) {
      console.log(webrtcClient);
    
      
      let consoleDescriptor = {
        Console: message
      };
      webrtcClient.emitUIInteraction(consoleDescriptor);
      setLoading(false);
      
     // webrtcClient.emitUIInteraction(descriptors.color.black);
    }
  }

  useEffect(() => {

    const args = {
      address: "wss://signalling-client.ragnarok.arcware.cloud/",
     // packageId: "ff41fd0c-cac9-4e4c-abe5-3ada402f57cc",
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
          <Responses responses={responses} />
        </div>
      </div>
    </div>
      

  
    </>
  );
}

export default App;