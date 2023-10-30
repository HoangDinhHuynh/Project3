const router = require('express').Router()
const {verifyAccessToken,isAdmin} =  require('../middlewares/verifytoken')
const ctrls = require('../controllers/couponHandler')

router.post('/',[verifyAccessToken,isAdmin],ctrls.createNewCoupon)
router.get('/',ctrls.getAllCoupon)
router.put('/:cid',[verifyAccessToken,isAdmin],ctrls.updateCoupon)
router.delete('/:cid',[verifyAccessToken,isAdmin],ctrls.deleteCoupon)

module.exports = router