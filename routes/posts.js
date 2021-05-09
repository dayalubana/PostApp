var express = require('express');
var router = express.Router();

var checkAuth = require('../middleware/check-auth')
var multerMiddleware = require('../middleware/multer')
var PostController = require('../controllers/post')

router.delete('/:id', checkAuth, PostController.DeletePost)

router.put('/:id', checkAuth, multerMiddleware,PostController.UpdatePost)

router.get('/',PostController.GetPosts)

router.get('/:id',PostController.GetPost)

router.post('/', checkAuth, multerMiddleware,PostController.CreatePost)

module.exports = router;