const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Eventos App
app.post('/eventos', (req, res) => {
  const event = req.body;

  // Posts
  axios.post('http://localhost:4000/recibirEventos', event);
  // Comments
  axios.post('http://localhost:4001/recibirEventos', event);
  // Querys
  axios.post('http://localhost:4002/recibirEventos', event);

  res.send({ status: 'OK' });
});

app.listen(4005, () => {
  console.log('Event Bus escuchando en puerto 4005...');
});
