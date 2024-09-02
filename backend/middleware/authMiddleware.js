const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler')
const User = require('../models/userModel')

const protect = asyncHandler(async(req, res, next) => {

    const token = req.cookies.jwt

    if(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findOne({_id: decoded.userId}).select('-password')
            next()
        } catch (error) {
            console.log(`Error: ${error}`);
            res.status(401)
            throw new Error(`Not Authorized, token failed`)
        }
    }else{
        res.status(401)
        throw new Error(`Not Authorized, no token found`)
    }
})

//Admin middleware
const admin = (req, res, next) => {
    if(req.user && req.user.isAdmin){
        next()
    }else{
        res.status(401)
        throw new Error(`Not Authorized as admin`)
    }
}

module.exports = {
    protect,
    admin
}