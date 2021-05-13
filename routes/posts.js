var express = require('express');
var router = express.Router();
var Post = require('../models/post');
var checkAuth = require('../middleware/check-auth')
// var multerMiddleware = require('../middleware/multer')
var PostController = require('../controllers/post')
var multer = require('multer');
var path = require('path')
var MIME_TYPES = {
    'image/png':'png',
    'image/jpeg':'jpg',
    'image/jpg':'jpg'
}
var storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        var isValid = MIME_TYPES[file.mimetype];
        if(isValid){
            cb(null,path.join(__dirname,'../images'));
        } else {
            cb(new Error('invalid mime type'),path.join(__dirname,'../images'));
        }
    },
    filename: (req,file,cb)=>{
        var name = file.originalname.toLocaleLowerCase().split(' ').join('-');
        cb(null,name+'-'+Date.now()+'.'+MIME_TYPES[file.mimetype]);
    }
})

// module.exports = multer({storage:storage}).single('image')

router.delete('/:id', checkAuth, PostController.DeletePost)

router.put('/:id',checkAuth,multer({storage:storage}).single('image'),(req,res)=>{
    let imagePath = req.body.imagePath;
    
    if(req.file){
        var url = 'https' + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename
    }
    Post.updateOne({_id:req.params.id},
        {
            _id: req.body.id,
            title: req.body.title,
            content: req.body.content,
            imagePath: imagePath,
            creator: "60929fefb1ec38622450f20a"
        }    
    )
    .then((re)=>{
        if(re.n>0){
            res.status(200).json({
                message: 'Successfully updated'
            })
        } else{
            res.status(401).json({
                message: 'UnAuthorized updation'
            })
        }
        
    })
})

router.get('/',PostController.GetPosts)

router.get('/:id',PostController.GetPost)

router.post('/', checkAuth, multer({storage:storage}).single('image'),PostController.CreatePost)

module.exports = router;