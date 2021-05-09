var jwt = require('jsonwebtoken');

module.exports = (req,res,next) =>{
    try{
        var token = req.headers.authorization.split(' ')[1];
        console.log(token);
        var user = jwt.verify(token,"must_be_long_secret_key");
        req.userData = {email: user.email,userId: user.userId};
        next();
    } catch(err){
        res.status(401).json({
            message: 'Unauthorized Access'
        })
    }
}