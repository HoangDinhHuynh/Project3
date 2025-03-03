const jwt = require('jsonwebtoken')
const asyncHanlder = require('express-async-handler')


// HÀM KIỂM TRA THỜI HẠN CỦA ACCESS TOKEN
const verifyAccessToken = asyncHanlder(async(req,res,next)=>{
    if(req?.headers?.authorization?.startsWith('Bearer')){
        const token = req.headers.authorization.split(' ')[1]
        jwt.verify(token, process.env.JWT_SECRET, (err,decode)=>{
            if (err) return res.status(401).json({
                success : false,
                mes : 'Invalid access token'
            })
            req.user = decode
            next()
        })
    }else{
        return res.status(401).json({
            success : false,
            mes : 'Require authentication ! '
        })
    }
}) 

// HÀM KIỂM TRA QUYỀN CỦA USER
const isAdmin = asyncHanlder((req,res,next)=>{
    const {role} = req.user
    if (+role !== 2000) 
    return res.status(401).json({
        success : false,
        mes: 'REQUIRE ADMIN ROLE !'
    })
    next() 
})


module.exports = {
    verifyAccessToken,
    isAdmin
}