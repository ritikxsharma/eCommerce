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

function checkFileType(req, file, cb){
    const fileTypes = /jpe?g|png|webp/
    const mimeTypes = /image\/jpe?g|image\/png|image\/webp/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase())
    const mimeType = mimeTypes.test(file.mimetype)
    
    if(extName && mimeType){
        return cb(null, true)
    }else{
        cb(new Error('Image only!!'), false)
    }
}

const upload = multer({
    storage, 
    checkFileType
})

const uploadSingleImage = upload.single('image')

router.post('/', (req, res) => {
    uploadSingleImage(req, res, function(err) {
        if(err){
            res.status(404).send({
                message: err.message
            })
        }

        res.status(200).send({
            message: 'Image uploaded successfully',
            image: `/${req.file.path}`
        })
        
    })

})

module.exports = router