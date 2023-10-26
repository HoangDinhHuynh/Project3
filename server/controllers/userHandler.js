const User = require('../models/user')
const asyncHanlder = require('express-async-handler')
const {generateAccessToken,generateRefreshToken} = require('../middlewares/jwt')

//  HÀM ĐĂNG KÝ
const register = asyncHanlder(async(req,res)=>{
    const{email,password,firstname,lastname,mobile}=req.body
    if (!email || !password || !firstname || !lastname || !mobile) 
    return res.status(400).json({
        success : false,
        mes: 'Missing inputs'
    })
    // báo lỗi user đã tồn tại
    const user = await User.findOne({email})
    if (user)
    throw new Error('User has existed!')
    else{
        const newUser = await User.create(req.body)
        return res.status(200).json({
            success: newUser ? true : false,
            mes : newUser ? 'Register is successfully. Please go Login~':'Something went wrong!'
        })
    }

    
    // const response = await User.create(req.body)
    // return res.status(200).json({
    //     success : response ? true : false,
    //     response
    // })
})
// HÀM ĐĂNG NHẬP
const login = asyncHanlder(async(req,res)=>{
    const{email,password}=req.body
    if (!email || !password ) 
    return res.status(400).json({
        success : false,
        mes: 'Missing inputs'
    })
   const response = await User.findOne({email})
   if (response && await response.isCorrectPassword(password)){
        // Tách password và role ra khỏi response
        const {password,role, ...userData} = response.toObject()
        // Tạo access Token
        const accessToken = generateAccessToken(response._id,role)
        // Tạo refresh Token
        const refreshToken = generateRefreshToken(response._id)
        // Lưu refreshToken vào database
        await User.findByIdAndUpdate(response._id, {refreshToken},{new:true})
        // Lưu refreshToken vào cookie
        res.cookie('refreshToken',refreshToken,{httpOnly:true,maxAge: 7*24*60*60*1000})
        return res.status(200).json({
            success : true ,
            accessToken,
            userData 
        })
   }
   else{
        throw new Error('Invalid Credentials!')
    }

})
// 
const getCurrent = asyncHanlder(async(req,res)=>{
    const {_id} = req.user
    const user = await User.findById(_id).select('-refreshToken -password -role')
    return res.status(200).json({
        success: false,
        rs : user ? user : 'User not found'
    })
})
module.exports = {
    register,login,getCurrent
}