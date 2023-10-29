const router = require('express').Router()
const {verifyAccessToken,isAdmin} =  require('../middlewares/verifytoken')
const ctrls = require('../controllers/blogHandler')


router.put('/like',[verifyAccessToken],ctrls.likeBlog)
router.get('/',ctrls.getBlogs)
router.post('/',[verifyAccessToken,isAdmin],ctrls.createNewBlog)
router.put('/:bid',[verifyAccessToken,isAdmin],ctrls.updateBlog)




module.exports = router