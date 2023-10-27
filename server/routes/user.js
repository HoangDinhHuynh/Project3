const router= require('express').Router()
const ctrls = require('../controllers/userHandler')
const {verifyAccessToken} = require('../middlewares/verifytoken')

router.post('/register',ctrls.register)
router.post('/login',ctrls.login)
router.get('/current',verifyAccessToken, ctrls.getCurrent)
router.post('/refreshtoken', ctrls.refreshAccessToken)
router.get('/logout', ctrls.logout)
router.get('/forgotpassword', ctrls.forgotPassword)
router.put('/reset-password', ctrls.resetPassword)


module.exports = router


// CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE