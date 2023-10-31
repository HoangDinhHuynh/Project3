const { model } = require('mongoose')
const Order = require('../models/order')
const User = require('../models/user')
const Coupon = require('../models/coupon')
const asyncHanlder = require('express-async-handler')


// HÀM TẠO ĐƠN HÀNG
const createOrder = asyncHanlder(async(req,res)=>{
    const {_id} = req.user
    const {coupon} = req.body
    const userCart = await User.findById(_id).select('cart').populate('cart.product','tiltle price')
    const products = userCart?.cart.map(el => ({
        product : el.product._id,
        count : el.quantity,
        color: el.color
    }))
    let total = userCart?.cart.reduce((sum,el)=> el.product.price* el.quantity + sum ,0)
    const createData = {products,total,orderBy: _id}
    if (coupon) {
        const selectedCoupon = await Coupon.findById(coupon)
        total = Math.round(total * (1 - +selectedCoupon?.discount / 100 ) / 1000)*1000 || total
        createData.total = total
        createData.coupon = coupon
    }
    const rs = await Order.create(createData)
    console.log(total)
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
