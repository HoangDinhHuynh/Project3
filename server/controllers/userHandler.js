const jwt = require('jsonwebtoken')
const User = require('../models/user')
const asyncHanlder = require('express-async-handler')
const {generateAccessToken,generateRefreshToken} = require('../middlewares/jwt')
const sendMail = require('../ultils/sendMail')
const crypto = require('crypto')
const makeToken = require('uniqid')



//  HÀM ĐĂNG KÝ
// const register = asyncHanlder(async(req,res)=>{
//     const{email,password,firstname,lastname,mobile}=req.body
//     if (!email || !password || !firstname || !lastname || !mobile ) 
//     return res.status(400).json({
//         success : false,
//         mes: 'Missing inputs'
//     })
//     // báo lỗi user đã tồn tại
//     const user = await User.findOne({email})
//     if (user)
//     throw new Error('User has existed!')
//     else{
//         const newUser = await User.create(req.body)
//         return res.status(200).json({
//             success: newUser ? true : false,
//             mes : newUser ? 'Register is successfully. Please go Login~':'Something went wrong!'
//         })
//     }
// })
const register = asyncHanlder(async (req, res) => {
    const { email, password, firstname, lastname, mobile } = req.body
    if (!email || !password || !firstname || !lastname || !mobile)
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
        })
    const user = await User.findOne({ email })
    if (user)
        throw new Error('User has existed!')
    else {
        const token = makeToken()
        res.cookie('dataregister', { ...req.body, token }, { httpOnly: true, maxAge: 15 * 60 * 1000 })
        const html = `Xin vui lòng click vào link dưới đây để hoàn tất quá trình đăng ký.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${process.env.URL_SERVER}/api/user/finalregister/${token}>Click Here</a>`
        await sendMail({ email, html, subject: 'Hoàn Tất Đăng Ký Digital World' })
        return res.json({
            success: true,
            mes: 'Please check your email to active account'
        })
    }

})
const finalRegister = asyncHanlder(async(req,res)=>{
    const cookie = req.cookies
    const {token} = req.params
    if(!cookie || cookie?.dataregister?.token  !== token) {
        res.clearCookie('dataregister')
        return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`)
    }
    const newUser = await User.create({
        email: cookie?.dataregister?.email,
        password: cookie?.dataregister?.password,
        mobile: cookie?.dataregister?.mobile,
        firstname: cookie?.dataregister?.firstname,
        lastname: cookie?.dataregister?.lastname,
    })
    res.clearCookie('dataregister')
    if(newUser) return res.redirect(`${process.env.CLIENT_URL}/finalregister/success`)
    else return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`)
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
        const {password,role,refreshToken, ...userData} = response.toObject()
        // Tạo access Token
        const accessToken = generateAccessToken(response._id,role)
        // Tạo refresh Token
        const newRefreshToken = generateRefreshToken(response._id)
        // Lưu refreshToken vào database
        await User.findByIdAndUpdate(response._id, {refreshToken:newRefreshToken},{new:true})
        // Lưu refreshToken vào cookie
        res.cookie('refreshToken',newRefreshToken,{httpOnly:true,maxAge: 7*24*60*60*1000})
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


// HÀM ĐĂNG XUẤT
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





// HÀM CẤP LẠI ACCESS TOKEN KHI REFRESH TOKEN CÒN HẠN
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




// HÀM QUÊN MẬT KHẨU
const forgotPassword = asyncHanlder(async(req,res)=>{
    const {email} = req.body
    if (!email) throw new Error('Missing Email!')
    const user = await User.findOne({email})
    if(!user) throw new Error('User not found')
    const resetToken = user.createPasswordChangedToken()
    await user.save()


    // 
    const html = `Xin vui lòng click vào link dưới đây để thay đổi mất khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Click Here</a>`

    const data = {
        email ,
        html,
        subject : 'Forgot Password'
    }
    const rs = await sendMail(data)
    return res.status(200).json({
        success: true,
        rs
    })
})


// HÀM ĐỔI MẬT KHẨU
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


// HÀM LẤY TẤT CẢ NGƯỜI DÙNG
const getAllUsers = asyncHanlder(async(req,res)=>{
    const response = await User.find().select('-refreshToken -password -role')
    return res.status(200).json({
        success : response ? true : false,
        user : response

    })
})


// HÀM LẤY RA THÔNG TIN CỦA 1 NGƯỜI DÙNG
const getCurrent = asyncHanlder(async(req,res)=>{
    const {_id} = req.user
    const user = await User.findById(_id).select('-refreshToken -password -role')
    return res.status(200).json({
        success: user ? true : false,
        rs : user ? user : 'User not found'
    })
})

// HÀM XOÁ NGƯỜI DÙNG
const deleteUser = asyncHanlder(async(req,res)=>{
    const {_id} = req.query
    if (!_id) throw new Error('Missing input !')
    const response = await User.findByIdAndDelete(_id)
    return res.status(200).json({
        success : response ? true : false,
        deleteUser : response ? `User with email : ${response.email} deleted`:'No user delete'

    })
})


// HÀM SỬA NGƯỜI DÙNG CỦA USER
const updateUser = asyncHanlder(async(req,res)=>{
    const {_id} = req.user
    if (!_id || Object.keys(req.body).length === 0)  throw new Error('Missing input !')
    const response = await User.findByIdAndUpdate(_id,req.body,{new :true}).select('-password -role -refreshToken')
    return res.status(200).json({
        success : response ? true : false,
        updatedUser : response ? response : 'Something went wrong'

    })
})


// HÀM SỬA NGƯỜI DÙNG CỦA ADMIN
const updateUserByAdmin = asyncHanlder(async(req,res)=>{
    const { uid} = req.params
    if (Object.keys(req.body).length === 0)  throw new Error('Missing input !')
    const response = await User.findByIdAndUpdate(uid,req.body,{new :true}).select('-password -role -refreshToken')
    return res.status(200).json({
        success : response ? true : false,
        updatedUser : response ? response : 'Something went wrong'

    })
})


// HÀM SỬA NGƯỜI DÙNG CỦA ADMIN
const updateUserAddress = asyncHanlder(async(req,res)=>{
    const { _id} = req.user
    if (!req.body.address)  throw new Error('Missing input !')
    const response = await User.findByIdAndUpdate(_id,{$push:{address:req.body.address}},{new :true}).select('-password -role -refreshToken')
    return res.status(200).json({
        success : response ? true : false,
        updatedUser : response ? response : 'Something went wrong'

    })
})


// HÀM SỬA NGƯỜI DÙNG CỦA ADMIN
const updateCart = asyncHanlder(async(req,res)=>{
    const { _id} = req.user
    const {pid ,quantity,color} =req.body
    if (!pid || !quantity || !color)  throw new Error('Missing input !')
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid) 
    if (alreadyProduct){
        if(alreadyProduct.color === color ){
            const response = await User.updateOne({cart:{$elemMatch:alreadyProduct}},{$set:{"cart.$.quantity":quantity}},{new:true})
            return res.status(200).json({
                success : response ? true : false,
                updatedUser : response ? response : 'Something went wrong'
        
            })
        }else{
            const response = await User.findByIdAndUpdate(_id,{$push:{cart:{product:pid,quantity,color}}},{new:true})
            return res.status(200).json({
                success : response ? true : false,
                updatedUser : response ? response : 'Something went wrong'
        
            })
        }
    }else{
        const response = await User.findByIdAndUpdate(_id,{$push:{cart:{product:pid,quantity,color}}},{new:true})
        return res.status(200).json({
            success : response ? true : false,
            updatedUser : response ? response : 'Something went wrong'
    
        })
    }
})



module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getAllUsers,
    deleteUser,
    updateUser,
    updateUserByAdmin,
    updateUserAddress,
    updateCart,
    finalRegister
}