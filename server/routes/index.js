const userRouter = require('./user')
const {notFound,errHandler} = require('../middlewares/ErrHandler')

const initRoutes = (app) =>{
    app.use('/api/user',userRouter)

    app.use(notFound)
    app.use(errHandler)
}

module.exports = initRoutes