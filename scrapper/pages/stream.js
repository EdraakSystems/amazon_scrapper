import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const StreamComponent = () => {
  const [streamData, setStreamData] = useState([]);

  useEffect(() => {
    console.log('asdf')
    const socket = io('http://localhost:4000');
    socket.on('connect', () => {
      console.log('Connected to stream');
    });
    socket.on('data', (data) => {
      console.log(data)
      setStreamData((prevData) => [...prevData, data]);
    });
  }, []);

  return (
    <div>
      <h2>Stream Data</h2>
      <ul>
        {streamData.map((data, index) => (
          <li key={index}>{data}</li>
        ))}
      </ul>
    </div>
  );
};

export default StreamComponent;