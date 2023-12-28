const { model } = require('mongoose')
const Order = require('../models/order')
const User = require('../models/user')
const Coupon = require('../models/coupon')
const asyncHanlder = require('express-async-handler')


// HÀM TẠO ĐƠN HÀNG
const createOrder = asyncHanlder(async(req,res)=>{
    const {_id} = req.user
    const {products, total, address, status} = req.body
    if(address) {
        await User.findByIdAndUpdate(_id,{address, cart: []})
    }
    const data = {...products, total, postedBy: _id}
    if(status) data.status = status
    const rs = await Order.create(data)
    return res.json({
        success : rs? true : false,
        rs : rs ? rs :'Something Went wrong'
    })
})


// HÀM SỬA ĐƠN HÀNG
const updateStatus = asyncHanlder(async(req,res)=>{
    const { oid} = req.params
    const { status} = req.body
    if (!status) throw new Error('Missing Status')
    const response = await Order.findByIdAndUpdate(oid,{status},{new:true})
    return res.json({
        success : response? true : false,
        response : response ? response :'Something Went wrong'
    })
})


// HÀM LẤY ĐƠN HÀNG
const getUserOrder = asyncHanlder(async(req,res)=>{
    const { _id} = req.user
    const response = await Order.find({orderBy:_id})
    return res.json({
        success : response? true : false,
        response : response ? response :'Something Went wrong'
    })
})


// HÀM LẤY TẤT CẢ ĐƠN HÀNG (ADMIN)
const getAllOrder = asyncHanlder(async(req,res)=>{
    const response = await Order.find()
    return res.json({
        success : response? true : false,
        response : response ? response :'Something Went wrong'
    })
})

module.exports ={
    createOrder,
    updateStatus,
    getUserOrder,
    getAllOrder
}
