const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const postdb = {};
postdb['12312'] = {
  id: '12312',
  title: 'hola',
  comments: [
    {
      id: '9191',
      content: 'primer comment',
    },
  ],
};

// Query App
// desc: entrega informacion
app.get('/posts', (req, res) => {
  res.status(200).json(postdb);
});

// desc: recibe y guarda informacion del cliente Eventos
app.post('/recibirEventos', (req, res) => {
  const { type, data } = req.body;
  if (type === 'PostCreado') {
    const { id, title } = data;
    postdb[id] = { id, title, comments: [] };
    console.log(postdb[id]);
  }
  if (type === 'ComentarioCreado') {
    const { id, content, postId, status } = data;
    // Este no existe, es undefined, si empieza tarde
    // Si este evento se apaga y se crea un Post que
    // no llega hasta aqui
    const post = postdb[postId];
    if (!post) {
      let error = `ComentarioCreado recibido, lamentablemente el Post con {id: ${postId}} asociado al comentario no existe.`;
      console.log(error);
      return res.send({ message: error });
    }
    post.comments.push({ id, content, status });
    console.log(post);
  }
  if (type === 'ComentarioActualizado') {
    const { id, postId, content, status } = data;
    const post = postdb[postId];
    const comment = post.comments.find((comment) => comment.id === id);
    comment.status = status;
    comment.content = content;
  }
  res.send('Servidor query enviando objeto');
});

app.listen(4002, () => {
  console.log('[Servidor Query]: escuchando en puerto 4002');
});
