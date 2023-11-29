const router= require('express').Router()
const ctrls = require('../controllers/userHandler')
const {verifyAccessToken,isAdmin} = require('../middlewares/verifytoken')

router.post('/register',ctrls.register)
router.post('/mock',ctrls.createUsers)
router.put('/finalregister/:token',ctrls.finalRegister)
router.post('/login',ctrls.login)
router.get('/current',[verifyAccessToken], ctrls.getCurrent)
router.post('/refreshtoken', ctrls.refreshAccessToken)
router.get('/logout', ctrls.logout)
router.post('/forgotpassword', ctrls.forgotPassword)
router.put('/reset-password', ctrls.resetPassword)
router.get('/', [verifyAccessToken,isAdmin],ctrls.getAllUsers)
router.delete('/:uid',[verifyAccessToken,isAdmin],ctrls.deleteUser)
router.put('/uduser',[verifyAccessToken], ctrls.updateUser)
router.put('/cart',[verifyAccessToken], ctrls.updateCart)
router.put('/address',[verifyAccessToken,isAdmin], ctrls.updateUserAddress)


router.put('/uduserbyadmin/:uid',[verifyAccessToken,isAdmin], ctrls.updateUserByAdmin)

module.exports = router


// CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE