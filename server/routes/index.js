const userRouter = require('./user')
const productRouter = require('./product')
const productCategoryRouter = require('./productCategory')
const blogCategoryRouter = require('./blogCategory')
const blogRouter = require('./blog')
const brandRouter = require('./brand')
const couponRouter = require('./coupon')
const orderRouter = require('./order')
const insertRouter = require('./inser')
const {notFound,errHandler} = require('../middlewares/ErrHandler')

const initRoutes = (app) =>{
    app.use('/api/user',userRouter)
    app.use('/api/product',productRouter)
    app.use('/api/blogcategory',blogCategoryRouter)
    app.use('/api/prodcategory',productCategoryRouter)
    app.use('/api/blog',blogRouter)
    app.use('/api/brand',brandRouter)
    app.use('/api/coupon',couponRouter)
    app.use('/api/order',orderRouter)
    app.use('/api/insert',insertRouter)



    app.use(notFound)
    app.use(errHandler)
}

module.exports = initRoutes