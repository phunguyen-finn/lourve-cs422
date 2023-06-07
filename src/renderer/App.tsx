import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import idleImg from '../../assets/idle.gif';
import talkingImg from '../../assets/talking.gif';
import { useState, useEffect } from 'react';
import './App.css';
import { FaMicrophone } from 'react-icons/fa';
import { askConversation, createConversation } from './api';

function Hello() {
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${idleImg})`,
          width: '100vw',
          height: '100vh',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      ></div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          width: '100vw',
          backgroundColor: 'rgba(30, 30, 30, 0.9)',
          fontWeight: 'normal',
          padding: '5px 10px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <FaMicrophone style={{ marginRight: 10 }} /> Doraemon
      </div>
    </>
  );
}

export default function App() {
  const [conversationId, setConversationId] = useState<string>('');

  useEffect(() => {
    window.electron.ipcRenderer.on('hotword-detected', async (_arg: any) => {
      if (conversationId) return;
      console.log('hotword detected');
      setConversationId(await createConversation());
    });

    window.electron.ipcRenderer.on('prompt-detected', async (arg: any) => {
      console.log(arg);
      const formData = new FormData();
      formData.append('audio_file', arg.uint8Array);
      const response = await askConversation(conversationId, formData);
      console.log(response);
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
