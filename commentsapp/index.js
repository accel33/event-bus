const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { randomBytes } = require('crypto');

const app = express()
app.use(bodyParser.json())
app.use(cors())

const commentsByPostId = {}
app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || [])
})

app.post('/posts/:id/comments', (req, res) => {
    // Crear ID
    const commentId = randomBytes(4).toString('hex')
    // Extraer contenido del Usuario
    const { content } = req.body
    // Obtengo comments =[{},{}...] de nuestra base de datos
    const comments = commentsByPostId[req.params.id] || []
    // Le agrego documentos a colleccion de comments
    comments.push({ id: commentId, content })
    // Lo guardo en nuestra base de datos
    commentsByPostId[req.params.id] = comments

    res.status(201).send(comments)
})

app.post('events', (req, res) => {
    res.send('Comment creado')
})

app.listen(4001, () => {
    console.log('App escuchando en puerto 4001');
})