var Post = require('../models/post');
exports.GetPost = (req,res,next)=>{
    Post.findOne({_id:req.params.id}).exec((err,d)=>{
        res.status(200).json(d)
    })
}

exports.CreatePost = (req,res)=>{
    var url = 'https' + '://' + req.get('host');
    var post = new Post({
        ...req.body,
        creator:req.userData.userId,
        imagePath: url + '/images/' + req.file.filename
    });
    post.save((err,re)=>{
        if(err){
            res.status(500).json(
                {
                    message: 'Post Failed',
                    postId: re._id
                }
            )
        } else {
            res.status(201).json(
                {
                    message: 'Post Successfully added',
                    post: {
                        id: re._id,
                        title: re.title,
                        content: re.content,
                        imagePath: re.imagePath
                    }
                }
            )
        }
    })
}

exports.GetPosts = (req,res,next)=>{
    let query = Post.find();
    pageSize = +req.query.pageSize;
    page = +req.query.page;
    let post;
    if(pageSize&& page){
        query.skip(pageSize*(page-1))
        .limit(pageSize);
    }
    query.then((d)=>{
        post = d;
        return Post.count();
    }).then((c)=>{
        res.status(200).json(
            {
                message: 'successfully fetched',
                posts: post,
                count:c
            }
        )
    })
    .catch((err)=>{
        res.status(500).json(
            {
                message: 'Internal Server error'
            }
        )
    })
}

exports.UpdatePost = (req,res)=>{
    let imagePath = req.body.imagePath;
    console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW");
    if(req.file){
        var url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename
    }
    console.log(imagePath);
    
    Post.updateOne({_id:req.params.id, creator: req.userData.userId},
        {
            _id: req.body.id,
            title: req.body.title,
            content: req.body.content,
            imagePath: imagePath,
            creator: req.userData.userId
        }    
    )
    .then((re)=>{
        if(re.n>0){
            res.status(200).json({
                message: 'Successfully updated'
            })
        } else{
            console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwww');
            res.status(401).json({
                message: 'UnAuthorized updation'
            })
        }
        
    })
}

exports.DeletePost = (req,res)=>{
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId})
    .then((re)=>{
        if(re.n==0){
            res.status(401).json({
                message: 'Deletion Failed'
            })
        } else {
            res.status(200).json({
                message: 'Deletion Successful'
            })
        }
    })
}