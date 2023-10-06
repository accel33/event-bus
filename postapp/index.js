const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios');

const app = express()
app.use(bodyParser.json())
app.use(cors())

const posts = {}

app.get('/posts', (req, res) => {
    res.send(posts)
})

app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex')
    const { title } = req.body
    posts[id] = { id, title }
    res.status(201).send(posts[id])
})

app.post('events', (req, res) => {
    // Al crear post mandar los datos al Bus de Eventos
    // await axios('https://localhost:4005/events')
    res.send('Post Creado')
})

app.listen(4000, () => {
    console.log('Servidor Post escuchando en puerto 4000');
})