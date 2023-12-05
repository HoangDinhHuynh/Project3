const router= require('express').Router()
const ctrls = require('../controllers/productHandler')
const {verifyAccessToken,isAdmin} = require('../middlewares/verifytoken')
const uploader = require('../config/cloudinary.config')



router.post('/createproduct',[verifyAccessToken,isAdmin],uploader.fields([
    {name : 'images' , maxCount:10},
    {name : 'thumb' , maxCount : 1}
]),ctrls.createProduct)
router.get('/getallproduct',ctrls.getAllProduct)
router.put('/ratings',[verifyAccessToken],ctrls.ratings)


router.put('/uploadimages/:pid',[verifyAccessToken,isAdmin],uploader.array('images',10),ctrls.uploadImagesProduct)
router.put('/updateproduct/varriant/:pid',[verifyAccessToken,isAdmin],uploader.fields([
    {name : 'images' , maxCount:10},
    {name : 'thumb' , maxCount : 1}
]),ctrls.addVarriant)
router.put('/updateproduct/:pid',[verifyAccessToken,isAdmin],uploader.fields([
    {name : 'images' , maxCount:10},
    {name : 'thumb' , maxCount : 1}
]),ctrls.updateProduct)
router.delete('/deleteproduct/:pid',[verifyAccessToken,isAdmin],ctrls.deleteProcduct)
router.get('/getproduct/:pid',ctrls.getProduct)


module.exports = router

