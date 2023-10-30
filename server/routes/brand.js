const router= require('express').Router()
const ctrls = require('../controllers/brandHandler')
const {verifyAccessToken,isAdmin} = require('../middlewares/verifytoken')

router.post('/',[verifyAccessToken,isAdmin],ctrls.createBrand)
router.get('/',ctrls.getAllBrand)
router.put('/:bid',[verifyAccessToken,isAdmin],ctrls.updateBrand)
router.delete('/:bid',[verifyAccessToken,isAdmin],ctrls.deleteBrand)


module.exports = router