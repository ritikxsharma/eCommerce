const path = require('path')
const express = require('express')
require('dotenv').config();
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db.js')
const {
    notFound,
    errorHandler
} = require('./middleware/errorHandler.js')

const port = process.env.PORT || 5000

connectDB()
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use('/api/products', require('./routers/productRouter.js'))
app.use(`/api/users`, require('./routers/userRouter.js'))
app.use('/api/orders', require('./routers/orderRouter.js'))
app.use('/api/upload', require('./routers/uploadRouter.js'))

app.get('/api/config/paypal', (req, res) => {
    res.send({
        clientId: process.env.PAYPAL_CLIENT_ID
    })
})

const _dirname = path.resolve()
app.use('/uploads', express.static(path.join(_dirname, '/uploads')))

if(process.env.NODE_ENV === 'production'){
    // set static folder
    app.use(express.static(path.join(_dirname, '/frontend/build')))

    // any route that is not api will be redirected to index.html
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(_dirname, 'frontend', 'build', 'index.html'))
    })
}else{
    app.get('/', (req, res) => {
        res.send(`API is running....`);
    })
}

app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`);
})