const express = require('express')
const path = require('path')
const multer = require('multer')

const router = express.Router()

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'uploads/')
    },
    filename(req, file, cb){
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

function checkFileType(file, cb){
    const fileTypes = /jpg|jpeg|png/
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase())
    const mimeType = fileTypes.test(file.mimetype)
    if(extName && mimeType){
        return cb(null, true)
    }else{
        cb('Image only!!')
    }
}

const upload = multer({
    storage
})

router.post('/', upload.single('image'), (req, res) => {
    console.log(req.body);
    res.send({
        message: 'Image uploaded',
        image: `/${req.file.path}`
    })
})

module.exports = router