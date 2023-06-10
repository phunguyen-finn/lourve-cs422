import { useEffect, useState } from 'react';
import { AiOutlineDownload } from 'react-icons/ai';
import { Navigate } from 'react-router-dom';
import { getConversations, getMe } from 'renderer/api';
import store from 'renderer/store';

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [isSignedOut, setIsSignedOut] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      getMe().then(() => {
        setUser(store.get('user'));
      });
    }
  }, []);

  return (
    <>
      {isSignedOut && <Navigate to="/account" />}
      {!isSignedOut && (
        <>
          <div
            style={{
              width: '100vw',
              height: '100vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'black',
            }}
          >
            Hello {user}! You're all set! Click
            <span
              onClick={() => {
                store.set('user', null);
                store.set('token', null);
                setUser(null);
                setIsSignedOut(true);
              }}
              style={{
                color: "blue"
              }}
            >
              &nbsp;HERE&nbsp;
            </span>
            to sign out,
            or here
            <span
              onClick={async () => {
                if (!store.get('token')) {
                  alert('Please login first');
                  return;
                }
                const content = await getConversations();
                let log = JSON.stringify(content);
                const blob = new Blob([log], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = 'log.json';
                link.href = url;
                link.click();
              }}
              style={{ color: "blue" }}
            >
              &nbsp;HERE&nbsp;
            </span>
            to download past conversations
          </div>
        </>
      )}
    </>
  );
}
