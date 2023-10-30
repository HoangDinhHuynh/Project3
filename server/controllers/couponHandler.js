const { model } = require('mongoose')
const Coupon = require('../models/coupon')
const asyncHanlder = require('express-async-handler')


// HÀM TẠO PHIẾU GIẢM GIÁ
const createNewCoupon = asyncHanlder(async(req,res)=>{
    const {name,discount,expiry} = req.body
    if (!name|| !discount || !expiry) throw new Error('Missing Inpusts')
    const response = await Coupon.create({
        ...req.body,
        expiry: Date.now() + +expiry*24*60*60*1000
    })
    return res.json({
        success : response? true : false,
        createdCoupon : response ? response :'Cannot create new Coupon'
    })
})


// HÀM LẤY PHIẾU GIẢM GIÁ
const getAllCoupon = asyncHanlder(async(req,res)=>{
    const response = await Coupon.find().select('-createdAt -updatedAt')
    return res.json({
        success : response? true : false,
        coupons : response ? response :'Cannot get Coupon'
    })
})


// HÀM SỬA PHIẾU GIẢM GIÁ
const updateCoupon = asyncHanlder(async(req,res)=>{
    const {cid} = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing Inpusts')
    if (req.body.expiry) req.body.expiry = Date.now() + +req.body.expiry*24*60*60*1000
    const response = await Coupon.findByIdAndUpdate(cid,req.body,{new:true})
    return res.json({
        success : response? true : false,
        updatedCoupon : response ? response :'Cannot update Coupon'
    })
})


// HÀM SỬA PHIẾU GIẢM GIÁ
const deleteCoupon = asyncHanlder(async(req,res)=>{
    const {cid} = req.params
    const response = await Coupon.findByIdAndDelete(cid)
    return res.json({
        success : response? true : false,
        updatedCoupon : response ? response :'Cannot update Coupon'
    })
})

module.exports ={
    createNewCoupon,
    getAllCoupon,
    updateCoupon,
    deleteCoupon
}