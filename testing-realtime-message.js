const { io } = require('socket.io-client');

const socket = io('http://localhost:3000', {
  auth: {
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTlmNWFkYmQxNTIxZTMzN2UyMmVhMWYiLCJlbWFpbCI6ImFiZHVsQG1haWwuY29tIiwiaWF0IjoxNzcyMDU4MTI1LCJleHAiOjE3NzIxNDQ1MjV9.3vx-G7JglC423ahvpWpx7CsZ-tgCitN0416nVxrZ2Pc',
  },
  transports: ['websocket'], // optional tapi bikin stabil
});

socket.on('connect', () => console.log('✅ connected', socket.id));
socket.on('disconnect', (reason) => console.log('❌ disconnected:', reason));
socket.on('connect_error', (err) =>
  console.log('❌ connect_error:', err.message),
);

socket.on('message.received', (payload) => console.log('📩 received', payload));
socket.on('message.delivered', (payload) =>
  console.log('✅ delivered', payload),
);

setInterval(() => {}, 1000);
