const { response, query } = require('express')
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
    const queries = {...req.query}
    // Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit','sort','page','fields']
    excludeFields.forEach(el => delete queries[el])
    
    
    // Formats lại các operators cho đúng cú pháp của mongoose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, macthedEl => `$${macthedEl}`) 
    const formatedQueries =  JSON.parse(queryString) 

    // Filtering
    if (queries?.tiltle) formatedQueries.tiltle = {$regex: queries.tiltle ,$options: 'i'}
    let queryCommand = Product.find(formatedQueries)

    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join('')
        queryCommand = queryCommand.sort(sortBy)
    }


    //  Execute query
    // Số lượng sp thoả mãn điều kiện !== số lượng trả về 1 lần gọi api
    queryCommand.exec(async(err,response) =>{
        if (err) throw new Error(err.message)
        const counts = await Product.find(formatedQueries).countDocuments()
        return res.status(200).json({
            success : response ? true : false,
            products : response ? response : 'Cannot get products',
            counts
        })
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