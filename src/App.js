import './App.css';
import {useRef, useEffect, useState} from 'react';
import { WebRTCClient } from "@arcware/webrtc-plugin"



const descriptors = {
  color: {
    'black': {
      Change_Attribute_Event: true,
      Attribute_Key: "Color",
      Attribute_Value: "Black",
    },
    'white': {
      Change_Attribute_Event: true,
      Attribute_Key: "Color",
      Attribute_Value: "White",
    },
    'yellow': {
      Change_Attribute_Event: true,
      Attribute_Key: "Color",
      Attribute_Value: "Metro_Exodus",
    }
  }
}

const paragraphs = [
  "Loading resources",
  "Loading textures",
  "Optimizing performace"
];

function AppUI (props) {
  const { emitUIInteraction } = props;

  function colorChange (event) {
      let command = 'Streamer'
    let consoleDescriptor = {
      Console: command
    };
    emitUIInteraction(consoleDescriptor);
    
    
   // emitUIInteraction(descriptors.color[event?.target?.value])
  }
  
  return (<div className="buttons-block">
            <select onChange={colorChange}>
              {Object.keys(descriptors.color).map(v => (<option key={v}>{v}</option>))}
            </select>
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
  let webrtcClientInit = false;


  const responseCallback = (message) => {
    console.log('response')
    setResponses([message, ...responses])
  }

  const videoInitialized = () => {
    
    setIsLoading(false)
    if (webrtcClient) {
      console.log(webrtcClient);
      webrtcClient.emitUIInteraction(descriptors.color.black);
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

  return (
    <div className="App">
      <div ref={sizeContainerRef}>
        <div ref={containerRef} style={{ zIndex: 1 }}>
          <video ref={videoRef} />
          {webrtcClient != null && <AppUI emitUIInteraction={webrtcClient.emitUIInteraction} />}
          <Responses responses={responses} />
        </div>
      </div>
    </div>
  );
}

export default App;
