// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Set();


let currentData = {
  currentTimeMs: null,
  healthColor: null,
  isVibe: null,
}

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

  console.log("called");

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(dataString);
    }
  });


  if (currentData.currentTimeMs == null || currentData.healthColor == null || currentData.isVibe == null) {
    res.send("no data");
    return;
  }


  let resultString = `${currentData.currentTimeMs}, ${currentData.healthColor}, ${currentData.isVibe}`;
  res.send(resultString);
});



// // HTTP GET endpoint
// app.get('/receiveData', (req, res) => {

// });


// ws.onopen = () => {
//   console.log("Connected to the server");

//   const sampleImageData = "base64EncodedImageData";
//   const sampleDescription = "description";
//   const sampleTitle = "hi! :D";

//   sendDataToServer(sampleImageData, sampleDescription, sampleTitle);
// };

// function sendDataToServer(imageData, description, title) {
//   const dataToSend = JSON.stringify({ image: imageData, description, title });
//   ws.send(dataToSend);
// }

// Start the server
server.listen(8005, () => {
  console.log('Server is listening on port 8005');
});
