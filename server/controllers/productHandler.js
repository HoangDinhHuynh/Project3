const Product = require('../models/product')
const asyncHanlder = require('express-async-handler')
const slugify = require('slugify')


// HÀM TẠO SẢN PHẨM 
const createProduct = asyncHanlder(async(req,res)=>{
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    if (req.body && req.body.tiltle) req.body.slug = slugify(req.body.tiltle)
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success : newProduct ? true : false,
        createProduct : newProduct ? newProduct : 'Cannot create new product'
    })

})


// HÀM LẤY RA 1 SẢN PHẨM
const getProduct = asyncHanlder(async(req,res)=>{
    const {pid} = req.params
    const product = await Product.findById(pid)
    return res.status(200).json({
        success : product ? true : false,
        productData : product ? product : 'Cannot get product'
    })

})


// HÀM LẤY RA TẤT CẢ SẢN PHẨM
const getAllProduct = asyncHanlder(async(req,res)=>{
    const products = await Product.find()
    return res.status(200).json({
        success : products ? true : false,
        productData : products ? products : 'Cannot get products'
    })

})


// HÀM SỬA SẢN PHẨM
const updateProduct = asyncHanlder(async(req,res)=>{
    const {pid} = req.params
    if (req.body && req.body.tiltle) req.body.slug = slugify(req.body.tiltle)
    const updatedProduct = await Product.findByIdAndUpdate(pid,req.body,{new:true})
    return res.status(200).json({
        success : updatedProduct ? true : false,
        updatedProduct : updatedProduct ? updatedProduct : 'Cannot update products'
    })

})


// HÀM XOÁ SẢN PHẨM
const deleteProcduct = asyncHanlder(async(req,res)=>{
    const {pid} = req.params
    const deletedProcduct = await Product.findByIdAndDelete(pid)
    return res.status(200).json({
        success : deletedProcduct ? true : false,
        deletedProcduct : deletedProcduct ? deletedProcduct : 'Cannot delete products'
    })

})
module.exports = {
    createProduct,
    getProduct,
    getAllProduct,
    updateProduct,
    deleteProcduct
}