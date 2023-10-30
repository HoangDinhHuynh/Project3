const router = require('express').Router()
const {verifyAccessToken,isAdmin} =  require('../middlewares/verifytoken')
const ctrls = require('../controllers/orderHandler')
const uploader = require('../config/cloudinary.config')

router.post('/' , [verifyAccessToken],ctrls.createOrder)





module.exports = router