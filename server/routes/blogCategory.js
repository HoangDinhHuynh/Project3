const router= require('express').Router()
const ctrls = require('../controllers/blogCategoryHandler')
const {verifyAccessToken,isAdmin} = require('../middlewares/verifytoken')

router.post('/',[verifyAccessToken,isAdmin],ctrls.createCategory)
router.get('/',ctrls.getAllCategory)
router.put('/:bcid',[verifyAccessToken,isAdmin],ctrls.updateCategory)
router.delete('/:bcid',[verifyAccessToken,isAdmin],ctrls.deleteCategory)


module.exports = router

