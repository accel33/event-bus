const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Eventos App
app.post('/eventos', async (req, res) => {
  const event = req.body;

  try {
    // Posts
    axios.post('http://localhost:4000/recibirEventos', event);
    // Comments
    axios.post('http://localhost:4001/recibirEventos', event);
    // Querys
    axios.post('http://localhost:4002/recibirEventos', event);
  } catch (error) {
    var now = new Date();
    var isoDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    console.log('fecha: ', isoDate.toUTCString());
    console.log('error code: ', error.code);
    console.log('cause: ', error.cause.constructor.name);
    // return res.status(400).json({ error: `${error.code}: ${causa}` });
    return res.status(400).json({ error: error.message });
  }
  res.send({ status: 'OK' });
});

app.listen(4005, () => {
  console.log('Event Bus escuchando en puerto 4005...');
});
