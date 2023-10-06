const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express()
app.use(cors())
app.use(express.json())

const postdb = {}
postdb['12312'] = {
    id: '12312',
    title: 'hola',
    comments: [
        {
            id: '9191',
            content: 'primer comment'
        }
    ]
}


app.get('event', (req, res) => {
    res.status(200).json(postdb)
})

app.post('event', (req, res) => {
    const { type, data } = req.body
    if (type === 'PostCreated') {
        const { id, tilte } = data
        post[id] = { id, title, comments: [] }
    }
    if (type === 'CommentCreated') {
        const { id, content, postId } = data
        const post = post[postId]
        post.comments.push({ id, content })
    }
    res.send('Servidor query enviando objeto')
})

app.listen(4002, () => {
    console.log('Servidor Query escuchando en puerto 4002');
})