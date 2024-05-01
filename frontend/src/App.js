import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
    <h1>HotPrimeFlix</h1>
     <video id="videoPlayer" width="70%" controls muted="muted" autoplay>
            <source src="http://localhost:3002/streaming" type="video/mp4" />
        </video>
    </div>
  );
}

export default App;
