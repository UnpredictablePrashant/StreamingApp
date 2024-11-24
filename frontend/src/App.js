import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
    <h1>HotPrimeFlix</h1>
     <video id="videoPlayer" width="70%" controls autoplay>
            <source src="http://aa5bfd8cac9bf4b14be8c896f5ff7d0f-1973175502.ap-south-1.elb.amazonaws.com:3002/streaming" type="video/mp4" />
        </video>
    </div>
  );
}

export default App;
