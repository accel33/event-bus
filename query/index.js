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
  if (type === 'PostCreated') {
    const { id, title } = data;
    postdb[id] = { id, title, comments: [] };
    console.log(postdb[id]);
  }
  if (type === 'CommentCreated') {
    const { id, content, postId } = data;
    // Este no existe, es undefined, si empieza tarde
    // Si este evento se apaga y se crea un Post que
    // no llega hasta aqui
    const post = postdb[postId];
    if (!post) {
      console.log(
        `CommentCreated recibido, lamentablemente el Post con {id: ${postId}} asociado al comentario no existe.`
      );
      return res.send('Servidor caido cuando se creo el Post');
    }
    post.comments.push({ id, content });
    console.log(post);
  }
  res.send('Servidor query enviando objeto');
});

app.listen(4002, () => {
  console.log('Query escuchando en puerto 4002');
});
