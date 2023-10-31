const router = require('express').Router()
const {verifyAccessToken,isAdmin} =  require('../middlewares/verifytoken')
const ctrls = require('../controllers/orderHandler')
const uploader = require('../config/cloudinary.config')


router.get('/' , [verifyAccessToken],ctrls.getUserOrder)
router.get('/admin' , [verifyAccessToken,isAdmin],ctrls.getAllOrder)
router.post('/' , [verifyAccessToken],ctrls.createOrder)
router.put('/status/:oid' , [verifyAccessToken,isAdmin],ctrls.updateStatus)





module.exports = router