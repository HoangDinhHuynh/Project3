const ProductCategory = require('../models/productCategory')
const asyncHanlder = require('express-async-handler')


// HÀM TẠO DANH MỤC
const createCategory = asyncHanlder(async(req,res)=>{
    const response = await ProductCategory.create(req.body)
    return res.json({
        success : response? true : false,
        createdCategory : response ? response :'Cannot create new product-Category'
    })
})

//  HÀM LẤY TẤT CẢ DANH MỤC
const getAllCategory = asyncHanlder(async(req,res)=>{
    const response = await ProductCategory.find()
    return res.json({
        success : response? true : false,
        AllProductCategory : response ? response :'Cannot get all product-Category'
    })
})

// HÀM SỬA DANH MỤC
const updateCategory = asyncHanlder(async(req,res)=>{
    const {pcid} = req.params
    const response = await ProductCategory.findByIdAndUpdate(pcid ,req.body,{new:true})
    return res.json({
        success : response? true : false,
        updatedCategory : response ? response :'Cannot update product-category'
    })
})

// HÀM XOÁ DANH MỤC
const deleteCategory = asyncHanlder(async(req,res)=>{
    const {pcid} = req.params
    const response = await ProductCategory.findByIdAndDelete(pcid)
    return res.json({
        success : response? true : false,
        updatedCategory : response ? response :'Cannot delete product-category'
    })
})
module.exports = {
    createCategory,
    getAllCategory,
    updateCategory,
    deleteCategory
}
