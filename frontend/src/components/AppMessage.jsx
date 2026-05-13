import React, { useEffect, useRef, useState } from 'react';
import './AppMessage.css';

const MESSAGE_DURATION = 3200;
const EXIT_DURATION = 260;

const AppMessage = () => {
  const [message, setMessage] = useState(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const hideTimer = useRef(null);
  const removeTimer = useRef(null);

  useEffect(() => {
    const handleMessage = (event) => {
      const detail = event.detail || {};
      const text = typeof detail === 'string' ? detail : detail.message;

      if (!text) return;

      clearTimeout(hideTimer.current);
      clearTimeout(removeTimer.current);

      setIsLeaving(false);
      setMessage({
        text,
        type: detail.type || 'info',
      });

      hideTimer.current = setTimeout(() => {
        setIsLeaving(true);
        removeTimer.current = setTimeout(() => {
          setMessage(null);
          setIsLeaving(false);
        }, EXIT_DURATION);
      }, detail.duration || MESSAGE_DURATION);
    };

    window.addEventListener('app-message', handleMessage);

    return () => {
      window.removeEventListener('app-message', handleMessage);
      clearTimeout(hideTimer.current);
      clearTimeout(removeTimer.current);
    };
  }, []);

  if (!message) return null;

  return (
    <div className="app-message-region" aria-live="polite" aria-atomic="true">
      <div className={`app-message app-message--${message.type} ${isLeaving ? 'app-message--leaving' : ''}`}>
        <span className="app-message__accent" />
        <p>{message.text}</p>
      </div>
    </div>
  );
};

export default AppMessage;
