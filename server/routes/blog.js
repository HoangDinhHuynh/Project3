const router = require('express').Router()
const {verifyAccessToken,isAdmin} =  require('../middlewares/verifytoken')
const ctrls = require('../controllers/blogHandler')
const uploader = require('../config/cloudinary.config')


router.get('/getallblog',ctrls.getAllBlogs)
router.post('/',[verifyAccessToken,isAdmin],ctrls.createNewBlog)

router.put('/uploadimages/:bid',[verifyAccessToken,isAdmin],uploader.single('images'),ctrls.uploadImagesBlog)
router.get('/getablog/:bid',ctrls.getBlog)
router.put('/like/:bid',[verifyAccessToken],ctrls.likeBlog)
router.put('/dislike/:bid',[verifyAccessToken],ctrls.dislikeBlog)
router.delete('/deleteblog/:bid',ctrls.deleteBlog)
router.put('/:bid',[verifyAccessToken,isAdmin],ctrls.updateBlog)




module.exports = router