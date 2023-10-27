const jwt = require('jsonwebtoken')
const User = require('../models/user')
const asyncHanlder = require('express-async-handler')
const {generateAccessToken,generateRefreshToken} = require('../middlewares/jwt')
const sendMail = require('../ultils/sendMail')
const crypto = require('crypto')


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


// Hàm lấy ra thông tin 1 người dùng
const getCurrent = asyncHanlder(async(req,res)=>{
    const {_id} = req.user
    const user = await User.findById(_id).select('-refreshToken -password -role')
    return res.status(200).json({
        success: false,
        rs : user ? user : 'User not found'
    })
})


// Hàm cấp lại access token khi refresh token còn hạn
const refreshAccessToken = asyncHanlder(async(req,res) => {
    // Lấy token từ cookie
    const cookie = req.cookies
    // Check xem có token hay không
    if (!cookie && !cookie.refreshToken) throw new Error('No refresh Token in cookies')
    // Check token có hợp lệ hay không
    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
    const response = await User.findOne({_id : rs._id ,refreshToken:cookie.refreshToken})
    return res.status(200).json({
        success : response ? true : false,
        newAccessToken : response ? generateAccessToken(response._id,response.role) : 'Refresh token not match'
    })

})


// Hàm Đăng Xuất
const logout = asyncHanlder(async(req,res) => {
    const cookie =  req.cookies
    if(!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
    // Xoá refresh token ở db
    await User.findOneAndUpdate({refreshToken:cookie.refreshToken},{refreshToken:''},{new:true})
    // Xoá refresh token cookie ở trình duyệt
    res.clearCookie('refreshToken'),{
        httpOnly :true,
        secure : true
    }
    return  res.status(200).json({
        success : true,
        mes : 'Logout is Done! '
    })
})

// Hàm Quên Mật Khẩu
const forgotPassword = asyncHanlder(async(req,res)=>{
    const {email} = req.query
    if (!email) throw new Error('Missing Email!')
    const user = await User.findOne({email})
    if(!user) throw new Error('User not found')
    const resetToken = user.createPasswordChangedToken()
    await user.save()


    // 
    const html = `Xin vui lòng click vào link dưới đây để thay đổi mất khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click Here</a>`

    const data = {
        email ,
        html
    }
    const rs = await sendMail(data)
    return res.status(200).json({
        success: true,
        rs
    })
})


// 
const resetPassword = asyncHanlder(async(req,res)=>{
    const {password,token} = req.body
    if(!password||!token) throw new Error('Missing input')
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({passwordResetToken,passwordResetExpires:{$gt:Date.now()}})
    if (!user) throw new Error('Invalid Reset Token')
    user.password = password
    user.passwordResetToken=undefined
    user.passwordChangedAt=Date.now()
    user.passwordResetExpires=undefined
    await user.save()
    return res.status(200).json({
        success:user? true:false,
        mes : user? 'Updated password' :'Something went wrong'
    })
})
module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword
}