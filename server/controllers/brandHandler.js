
const Brand = require('../models/brand')
const asyncHanlder = require('express-async-handler')


// HÀM TẠO DANH MỤC
const createBrand = asyncHanlder(async(req,res)=>{
    const response = await Brand.create(req.body)
    return res.json({
        success : response? true : false,
        createdBrand : response ? response :'Cannot create new Brand'
    })
})

//  HÀM LẤY TẤT CẢ DANH MỤC
const getAllBrand = asyncHanlder(async(req,res)=>{
    const response = await Brand.find().select('tiltle _id')
    return res.json({
        success : response? true : false,
        AllBrand : response ? response :'Cannot get all Brand'
    })
})

// HÀM SỬA DANH MỤC
const updateBrand = asyncHanlder(async(req,res)=>{
    const {bid} = req.params
    const response = await Brand.findByIdAndUpdate(bid ,req.body,{new:true})
    return res.json({
        success : response? true : false,
        updatedBrand : response ? response :'Cannot update Brand'
    })
})

// HÀM XOÁ DANH MỤC
const deleteBrand = asyncHanlder(async(req,res)=>{
    const {bid} = req.params
    const response = await Brand.findByIdAndDelete(bid)
    return res.json({
        success : response? true : false,
        deleteBrand: response ? response :'Cannot delete Brand'
    })
})
module.exports = {
    createBrand,
    getAllBrand,
    updateBrand,
    deleteBrand
}
