const router= require('express').Router()
const ctrls = require('../controllers/productCategoryHandler')
const {verifyAccessToken,isAdmin} = require('../middlewares/verifytoken')

router.post('/',[verifyAccessToken,isAdmin],ctrls.createCategory)
router.get('/',ctrls.getAllCategory)
router.put('/:pcid',[verifyAccessToken,isAdmin],ctrls.updateCategory)
router.delete('/:pcid',[verifyAccessToken,isAdmin],ctrls.deleteCategory)


module.exports = router

