const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');

app.use(bodyParser.json());

// Moderator Service
// Este servidor solo esta a la espera de eventos

app.post('/recibirEventos', async (req, res) => {
  const { type, data } = req.body;
  if (type === 'ComentarioCreado') {
    const status = data.content.includes('orange') ? 'rechazado' : 'aprovado';
    try {
      await axios.post('http://localhost:4005/eventos', {
        type: 'ComentarioModerado',
        data: {
          id: data.id,
          postId: data.postId,
          status: status,
          content: data.content,
        },
      });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ message: error.message });
    }
    res.send({});
  }
});

app.listen(4003, () => {
  console.log('[Servicio Moderador]: Escuchando en el puerto 4003...');
});
