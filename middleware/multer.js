var multer = require('multer');
var MIME_TYPES = {
    'image/png':'png',
    'image/jpeg':'jpg',
    'image/jpg':'jpg'
}
var storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        var isValid = MIME_TYPES[file.mimetype];
        if(isValid){
            cb(null,'backend/images');
        } else {
            cb(new Error('invalid mime type'),'backend/images');
        }
    },
    filename: (req,file,cb)=>{
        var name = file.originalname.toLocaleLowerCase().split(' ').join('-');
        cb(null,name+'-'+Date.now()+'.'+MIME_TYPES[file.mimetype]);
    }
})

module.exports = multer({storage:storage}).single('image')