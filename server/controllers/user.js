const User = require('../models/user')
const asyncHanlder = require('express-async-handler')


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
    const {password,role, ...userData} = response.toObject()
        return res.status(200).json({
            success : true ,
            userData 
        })
   }
   else{
        throw new Error('Invalid Credentials!')
    }

})
module.exports = {
    register,login
}