// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);

  ws.on('close', () => clients.delete(ws));

  ws.on('message', (message) => {
      try {
          const parsedData = JSON.parse(message);
          currentData = { ...currentData, ...parsedData };
          console.log('Updated currentData:', currentData);
      } catch (error) {
          console.error('Error parsing JSON:', error);
      }
  });
});

// HTTP GET endpoint
app.get('/sendData', (req, res) => {
  const data = req.query.message || 'No message provided';

  const x = req.query.x;
  const y = req.query.y;
  const z = req.query.z;
  const pressed = req.query.pressed;

  let isPressed = pressed === "t";

  const dataString = `${x},${y},${z},${isPressed}`;


  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(dataString);
    }
  });

  res.send('Notification sent  to all clients');
});


let currentData = {
  image: null,
  description: null,
  title: null,
}

// HTTP GET endpoint
app.get('/receiveData', (req, res) => {

  if (!currentData.image || !currentData.description || !currentData.title) {
    res.status(200);
    res.send("no data");
    return;
  }

  let resultString = `${currentData.image.toString()}, ${currentData.description}, ${currentData.title}`;

  res.send(resultString);
});





// Start the server
server.listen(8005, () => {
  console.log('Server is listening on port 8005');
});
