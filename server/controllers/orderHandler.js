const { model } = require('mongoose')
const Order = require('../models/order')
const User = require('../models/user')
const asyncHanlder = require('express-async-handler')


// HÀM TẠO ĐƠN HÀNG
const createOrder = asyncHanlder(async(req,res)=>{
    const {_id} = req.user
    const userCart = await User.findById(_id).select('cart')
    return res.json({
        success : userCart? true : false,
        createdBlog : userCart ? userCart :'Cannot create new Order'
    })
})



module.exports ={
    createOrder
}
