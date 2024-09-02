const express = require('express')
const router = express.Router()
const {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getTopProducts
} = require('../controllers/productController')
const {
    protect,
    admin
} = require('../middleware/authMiddleware')
const checkObjectId = require('../middleware/checkObjectId')

router.route('/').get(getAllProducts).post(protect, admin, addProduct)
router.route('/topProducts').get(getTopProducts)
router.route('/:id').get(checkObjectId, getProductById).put(protect, admin, checkObjectId, updateProduct).delete(protect, admin, checkObjectId, deleteProduct)
router.route('/:id/reviews').post(protect, checkObjectId, createProductReview)

module.exports = router