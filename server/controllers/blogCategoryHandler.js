const BlogCategory = require('../models/blogCategory')
const asyncHanlder = require('express-async-handler')


// HÀM TẠO DANH MỤC
const createCategory = asyncHanlder(async(req,res)=>{
    const response = await BlogCategory.create(req.body)
    return res.json({
        success : response? true : false,
        createdCategory : response ? response :'Cannot create new blog-Category'
    })
})

//  HÀM LẤY TẤT CẢ DANH MỤC
const getAllCategory = asyncHanlder(async(req,res)=>{
    const response = await BlogCategory.find().select('tiltle _id')
    return res.json({
        success : response? true : false,
        AllBlogCategory : response ? response :'Cannot get all blog-Category'
    })
})

// HÀM SỬA DANH MỤC
const updateCategory = asyncHanlder(async(req,res)=>{
    const {bcid} = req.params
    const response = await BlogCategory.findByIdAndUpdate(bcid ,req.body,{new:true})
    return res.json({
        success : response? true : false,
        updatedCategory : response ? response :'Cannot update blog-category'
    })
})

// HÀM XOÁ DANH MỤC
const deleteCategory = asyncHanlder(async(req,res)=>{
    const {bcid} = req.params
    const response = await BlogCategory.findByIdAndDelete(bcid)
    return res.json({
        success : response? true : false,
        updatedCategory : response ? response :'Cannot delete blog-category'
    })
})
module.exports = {
    createCategory,
    getAllCategory,
    updateCategory,
    deleteCategory
}
