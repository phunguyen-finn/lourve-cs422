import {
  MemoryRouter as Router,
  Routes,
  Route,
  HashRouter,
} from 'react-router-dom';
import idleImg from '../../assets/idle.gif';
import talkingImg from '../../assets/talking.gif';
import wakeUpSound from '../../assets/wake_up.mp3';
import sleepSound from '../../assets/sleep.mp3';
import { useRef, useState, useEffect, useMemo } from 'react';
import './App.css';
import { FaMicrophone } from 'react-icons/fa';
import { AiOutlineDownload } from 'react-icons/ai';
import { askConversation, createConversation, getConversations } from './api';
import { Howl } from 'howler';
import { LoginPage } from './pages/login-pages/LoginPage';
import { SignUpPage } from './pages/signup-pages/SignUpPage';
import AccountPage from './pages/account-page';
import store from './store';

function Mainscreen() {
  const conversationId = useRef<string>('');
  const [isThinking, setIsThinking] = useState<Boolean>(false);
  const [isTalking, setIsTalking] = useState<Boolean>(false);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      'hotword-detected',
      async (event, _arg: any) => {
        setIsTalking(false);
        new Howl({
          src: [wakeUpSound],
          format: ['mp3'],
        }).play();
      }
    );

    window.electron.ipcRenderer.on(
      'prompt-detected',
      async (event, arg: any) => {
        new Howl({
          src: [sleepSound],
          format: ['mp3'],
        }).play();

        setIsThinking(true);

        let _conversation = conversationId.current;
        if (_conversation === '') {
          _conversation = (await createConversation()).id;
          conversationId.current = _conversation;
        }

        const formData = new FormData();
        formData.append(
          'audio_file',
          new Blob([arg.uint8Array], { type: 'audio/wav' }),
          'audio.wav'
        );

        let response = await askConversation(_conversation, formData);
        const sound = new Howl({
          src: [URL.createObjectURL(response)],
          format: ['wav'],
          onend: function () {
            setIsTalking(false);
            setTimeout(() => {
              event.sender.send('prompt-answered');
              new Howl({
                src: [sleepSound],
                format: ['mp3'],
              }).play();
            }, 2000);
          },
          onplay: function () {
            setIsTalking(true);
          },
        });

        setIsThinking(false);
        sound.play();
      }
    );

    window.electron.ipcRenderer.on(
      'silent-prompt-detected',
      async (event, _arg: any) => {
        const sound = new Howl({
          src: [sleepSound],
          format: ['mp3'],
          onend: function () {
            setIsTalking(false);
          },
        });
        sound.play();
      }
    );
  }, []);

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${isTalking ? talkingImg : idleImg})`,
          width: '100vw',
          height: '100vh',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          filter: `${isThinking ? 'blur(5px) brightness(0.85)' : ''}`,
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
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: 'rgba(30, 30, 30, 0.9)',
          fontWeight: 'normal',
          padding: '5px 10px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
      </div>
      {isThinking && (
        <div
          className="fade-in-out"
          style={{
            position: 'absolute',
            top: 40,
            right: 40,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {' '}
          Lemme think..{' '}
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/account"
          element={
            <Routes>
              <Route path="/" element={<LoginPage />} />
            </Routes>
          }
        ></Route>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/access" element={<AccountPage />} />
        <Route path="/main" element={<Mainscreen />} />
      </Routes>
    </HashRouter>
  );
}
