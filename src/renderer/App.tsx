import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import idleImg from '../../assets/idle.gif';
import talkingImg from '../../assets/talking.gif';
import './App.css';

function Hello() {
  return (
    <div style={{ backgroundImage: `url(${idleImg})`, width: "100vw", height: "100vh", backgroundSize: "cover", backgroundPosition: "center" }}>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
