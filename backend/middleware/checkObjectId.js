const { isValidObjectId } = require('mongoose')

function checkObjectId(req, res, next){
    if(!isValidObjectId(req.params.id)){
        res.status(404)
        throw new Error(`Invalid Object Id : ${req.params.id}`)
    }
    next()
}

module.exports = checkObjectId