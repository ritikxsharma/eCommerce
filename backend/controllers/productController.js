const asyncHandler = require('../middleware/asyncHandler')
const ProductModel = require('../models/productModel')

// @desc Fetch all products
// @route GET /api/products
// @access Public
const getAllProducts = asyncHandler(async(req, res) => {
    const products = await ProductModel.find({})
    if(products){
        res.json(products)
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

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
}