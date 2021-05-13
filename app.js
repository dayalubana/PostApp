const express = require('express');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Post = require('./models/post');
var posts = require('./routes/posts');
var users = require('./routes/users')
var path = require('path');
const app = express();

// Database connection
mongoose.connect("mongodb+srv://daya:daya@cluster0.vzl5v.mongodb.net/Posts?retryWrites=true&w=majority", {useNewUrlParser: true})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
console.log(path.join(__dirname,'/images'));
// app.use('/images',express.static('/images'));

app.use("/images", express.static(path.join("images")));
app.use('/',express.static(path.join(__dirname,'angular')));

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With,Content-Type, Accept, Authorization',
    );
    res.setHeader('Access-Control-Allow-Methods',
    'GET,POST,PATCH,DELETE,OPTIONS,PUT'
    )
    next();
});

// app.use((req,res,next)=>{
//     res.send('app is running');
// })

app.use('/api/posts',posts);
app.use('/api/user',users);
// app.use((req,res,next)=>{
//     res.sendFile(path.join(__dirname,'angular','index.html'));
// })

module.exports = app;