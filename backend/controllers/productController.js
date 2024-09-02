const asyncHandler = require('../middleware/asyncHandler')
const ProductModel = require('../models/productModel')

// @desc Fetch all products
// @route GET /api/products
// @access Public
const getAllProducts = asyncHandler(async(req, res) => {

    const pageSize = process.env.PAGINATION_SIZE
    const page = Number(req.query.pageNumber || 1)

    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword, 
            $options: 'i'
        }
    } : {}

    const count = await ProductModel.countDocuments({...keyword})

    const products = await ProductModel.find({}).limit(pageSize).skip(pageSize * (page - 1))
    if(products){
        res.json({products, page, pages: Math.ceil(count / pageSize)})
    }else{
        res.json('No products found')
    }
})

// @desc Fetch a product
// @route GET /api/product/:id
// @access Public
const getProductById = asyncHandler(async(req, res) => {
    const product = await ProductModel.findById(req.params.id)
    
    if(product){
        res.json(product)
    }else{
        res.status(404)
        throw new Error('Resource not found')
    }
})

// @desc Add a product
// @route GET /api/product/
// @access Private/Admin
const addProduct = asyncHandler(async(req, res) => {
    const product = new ProductModel({
        name: 'Sample Name',
        price: 0,
        user: req.user._id,
        image: 'dfgdf',
        brand: 'sample brand',
        category: 'sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'sample desc'
    })
    const addedProduct = await product.save()
    res.status(201).json(addedProduct)
})

// @desc Update product
// @route PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async(req, res) => {
    const{
        name, price, description, image, brand, category, countInStock
    } = req.body

    const product = await ProductModel.findById(req.params.id)
    if(product){
        product.name = name
        product.price = price
        product.description = description
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock
        
        const updatedProduct = await product.save()
        res.json(updatedProduct)
    }else{
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc Delete product
// @route DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async(req, res) => {

    const product = await ProductModel.findById(req.params.id)
    if(product){
        await ProductModel.deleteOne({_id: product._id})
        res.status(200).json({
            message: 'Product deleted successfully'
        })
    }else{
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc Create a new review
// @route POST /api/products/:id/reviews
// @access Private
const createProductReview = asyncHandler(async(req, res) => {
    const {
        productId,
        rating,
        comment
    } = req.body

    const product = await ProductModel.findById(productId)

    if(product){
        const alreadyReviewed = product.reviews.find((review) => review.user.toString() === req.user._id.toString())
        if(alreadyReviewed){
            res.status(404)
            throw new Error('You have already reviewed the product')            
        }
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }

        product.reviews.push(review)
        product.numReviews = product.reviews.length
        product.rating = (
            product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
        )

        await product.save();

        res.status(201).json({
            message: 'Review added'
        })
    }else{
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc Fetch a product
// @route GET /api/product/:id
// @access Public
const getTopProducts = asyncHandler(async(req, res) => {
    const products = await ProductModel.find({}).sort({rating: -1}).limit(3)
    res.status(200).json(products)
})

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getTopProducts
}