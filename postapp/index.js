const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

// Posts App
app.get('/posts', (req, res) => {
  res.send(posts);
});

// Recibe informacion, guardala en BD y enviala al Bus de Eventos
app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;
  posts[id] = { id, title };

  try {
    // Manda informacion a esta ruta que tiene el servidor Bus de Eventos
    await axios.post('http://localhost:4005/eventos', {
      type: 'PostCreated',
      data: { id, title },
    });
  } catch (error) {
    // console.log(Object.keys(error));
    console.log('error code: ', error.code);
    console.log('cause: ', error.cause?.constructor.name);
    console.log('url: ', error.response?.config.url);

    return res.status(400).json({ error: error.toString() });
  }

  res.status(201).send(posts[id]);
});

app.post('/recibirEventos', (req, res) => {
  console.log('Evento recibido', req.body.type);
  res.send({});
});

app.listen(4000, () => {
  console.log('Post escuchando en puerto 4000');
});
