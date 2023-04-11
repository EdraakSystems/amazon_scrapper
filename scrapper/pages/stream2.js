import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = socketIOClient('http://localhost:4000');

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('data', (message) => {
      console.log('Message received:', message);
      setMessages((messages) => [...messages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);



  return (
    <div>
        {message}
     </div>
  );
}

export default App;