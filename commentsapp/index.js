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
  // if (!content) {
  //   try {
  //     const res = await axios.get('http://localhost:4002/posts');
  //     console.log(res);
  //     data = res;
  //   } catch (error) {
  //     return res.status(404);
  //   }
  // }
  const commentId = randomBytes(4).toString('hex');
  const comments = commentsByPostId[req.params.id] || []; // getCommentList()
  comments.push({ id: commentId, content, status: 'pending' });
  commentsByPostId[req.params.id] = comments;
  try {
    // Manda informacion a esta ruta que tiene el servidor Bus de Eventos
    await axios.post('http://localhost:4005/eventos', {
      type: 'ComentarioCreado',
      data: {
        id: commentId,
        content,
        postId: req.params.id,
        status: 'pending',
      },
    });
  } catch (error) {
    // console.log(Object.keys(error));
    console.log('error code: ', error.code);
    console.log('cause: ', error.cause?.constructor?.name);
    console.log('message: ', error.message);
    console.log('url: ', error.response?.config.url);

    console.log('statusText: ', error.response?.statusText);
    console.log('statusCode: ', error.request?.res?.statusCode);
    return res.status(400).json({ error: error.toString() });
  }

  res.status(201).send(comments);
});

app.post('/recibirEventos', async (req, res) => {
  console.log('Evento recibido', req.body.type);
  const { type, data } = req.body;

  if (type === 'ComentarioModerado') {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => id === comment.id);
    comment.status = status; // Modificando la base de datos directamente
    try {
      await axios.post('http://localhost:4005/eventos', {
        type: 'ComentarioActualizado',
        data: { id, postId, status, content },
      });
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ message: error.message });
      return;
    }
  }
  res.send({});
});

app.listen(4001, () => {
  console.log('[Servicio Comments]: escuchando en puerto 4001');
});
