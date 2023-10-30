const router= require('express').Router()
const ctrls = require('../controllers/productHandler')
const {verifyAccessToken,isAdmin} = require('../middlewares/verifytoken')
const uploader = require('../config/cloudinary.config')



router.post('/createproduct',[verifyAccessToken,isAdmin],ctrls.createProduct)
router.get('/getallproduct',ctrls.getAllProduct)
router.put('/ratings',[verifyAccessToken],ctrls.ratings)


router.put('/uploadimages/:pid',[verifyAccessToken,isAdmin],uploader.array('images',10),ctrls.uploadImagesProduct)
router.put('/updateproduct/:pid',[verifyAccessToken,isAdmin],ctrls.updateProduct)
router.delete('/deleteproduct/:pid',[verifyAccessToken,isAdmin],ctrls.deleteProcduct)
router.get('/getproduct/:pid',ctrls.getProduct)


module.exports = router

