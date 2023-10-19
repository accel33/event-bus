const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {
  id: [],
};

// Comments App
app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

// Recibe informacion, guardala en BD y enviala al Bus de Eventos
app.post('/posts/:id/comments', async (req, res) => {
  const { content } = req.body;
  const commentId = randomBytes(4).toString('hex');
  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ id: commentId, content });
  commentsByPostId[req.params.id] = comments;
  try {
    // Manda informacion a esta ruta que tiene el servidor Bus de Eventos
    await axios.post('http://localhost:4005/eventos', {
      type: 'CommentCreated',
      data: {
        id: commentId,
        content,
        postId: req.params.id,
      },
    });
  } catch (error) {
    console.log('error code: ', error.code);
    console.log('cause: ', error.cause.constructor.name);
    return res.status(400).json({ error: error.toString() });
  }

  res.status(201).send(comments);
});

app.post('/recibirEventos', (req, res) => {
  console.log('Evento recibido', req.body.type);
  res.send({});
});

app.listen(4001, () => {
  console.log('Comments escuchando en puerto 4001');
});
