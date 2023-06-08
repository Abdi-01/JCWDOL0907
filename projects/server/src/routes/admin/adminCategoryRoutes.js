const express = require('express')
const { adminCategoryController } = require('../../controllers')
const { check } = require('express-validator')
const upload = require('../../middleware/uploadMiddleware')
const router = express.Router()

router.get('/categories', adminCategoryController.getCategory)
router.post('/categories',
  upload.single('image'),
  check('product_category_name').notEmpty().withMessage('Category name is required'),
  adminCategoryController.createCategory)
router.put('/categories/:categoryId',
  check('product_category_name').notEmpty().withMessage('Category name is required'),
  adminCategoryController.updateCategory)
router.delete('/categories/:categoryId', adminCategoryController.deleteCategory)

module.exports = router