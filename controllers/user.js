var User = require('../models/user')
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

exports.UserLogin = (req,res)=>{
    var fetchedUser;
    User.findOne({email: req.body.email})
    .then((user)=>{
        if(!user){
            return res.status(401).json({
                message: 'Invalid user credentials.'
            })
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password,user.password)
    })
    .then((result)=>{
        if(!result){
            return res.status(401).json({
                message: 'Invalid user credentials.'
            })
        }
        var token = jwt.sign({email: fetchedUser.email,userId: fetchedUser._id},"must_be_long_secret_key",
        {expiresIn:'1h'});
        return res.status(200).json({
            message: 'Auth Success',
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id
        })
    })
}

exports.CreateUser = (req,res)=>{
    bcrypt.hash(req.body.password,10)
    .then((hash)=>{
        console.log(hash);
        var user = new User({
            email: req.body.email,
            password: hash
        })
        user.save((err,d)=>{
            if(err){
                res.status(401).json({
                    message: 'Failed to create new user'
                })
            } else{
                res.status(200).json({
                    message: 'User created'
                })
            }
        })
    })
}