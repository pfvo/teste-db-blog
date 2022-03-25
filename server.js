const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload')
const app = express();

const knex = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'pfvo',
      password : '',
      database : 'testblog'
    }
  });


let initialPath = path.join(__dirname, '/public');
app.use(fileUpload())
app.use(express.json())
app.use(express.static(initialPath))

app.get('/', (req, res)=> {
    res.sendFile(path.join(initialPath, 'index.html'))
    res.status(400).json('worked')
})

app.get('/editor', (req, res) => {
    res.sendFile(path.join(initialPath, 'editor.html'))
})

app.post('/upload', (req, res) => {
    
    if(req.files.bannerImage) {
       req.files.bannerImage.mv('public/uploads/banners/' + req.files.bannerImage.name)
       return res.json('/uploads/banners/' + req.files.bannerImage.name)
    }
    req.files.image.mv('public/uploads/images/' + req.files.image.name)       
    return res.json({imagePath: '/uploads/images/' + req.files.image.name, imageName: req.files.image.name })
})

app.post('/pub', (req, res)=> {
    const { banner, tittle, content } = req.body;
    knex.transaction(trx => {
        trx.insert({
            banner_img: banner,
            tittle: tittle
        })
        .into('previews')
        .returning("*")
        .then(preview => {
            return trx('posts')
            .returning("*")
            .insert({
                banner_img: preview[0].banner_img,
                tittle: preview[0].tittle, 
                content: content,
                created: new Date()
            })
            .then(data => res.json(data))
        })
        .then(trx.commit)
        .catch(trx.rollback)
        })
    .catch(err => res.status(400).json('Unable to store your post', err))
})

app.get('/:id', (req, res) => {
    res.sendFile(path.join(initialPath, 'blogpost.html'))
})

app.post('/blogid', (req, res) => {
    knex('posts')
    .where({
        id: req.body.id
    })
    .then(data => res.json(data[0]))
})

app.post('/latestPosts', (req, res) => {
     knex.select().from('previews')
    .then(data => res.json(data))
    
})


app.listen(process.env.PORT || 3000, ()=> console.log('listening......'))