const { response, query } = require('express')
const Product = require('../models/product')
const asyncHanlder = require('express-async-handler')
const slugify = require('slugify')
const makeSKU = require('uniqid')


// HÀM TẠO SẢN PHẨM 
const createProduct = asyncHanlder(async(req,res)=>{
    const {tiltle, price, description, brand, category, color} = req.body
    const thumb = req?.files?.thumb[0]?.path
    const images = req.files?.images?.map(el => el.path)
    if (!(tiltle && price && description && brand && category && color)) throw new Error('Missing inputs')
    req.body.slug = slugify(tiltle)
    if(thumb) req.body.thumb = thumb
    if(images) req.body.images = images
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success : newProduct ? true : false,
        mes : newProduct ? 'Created' : 'Failed'
    })

})


// HÀM LẤY RA 1 SẢN PHẨM
const getProduct = asyncHanlder(async(req,res)=>{
    const {pid} = req.params
    const product = await Product.findById(pid).populate({
        path:'ratings',
        populate: {
            path :'postedBy',
            select:'firstname lastname avatar'
        }
    })
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
    const restQueries =  JSON.parse(queryString)
    let formatedQueries = {} 
    
    // Filtering
    if (queries?.color) {
        delete restQueries.color
        const colorQuery = queries.color?.split(',').map(el=>({color :{$regex:el,$options:'i'}}))
        formatedQueries = {$or : colorQuery}
    }
    if (queries?.tiltle) restQueries.tiltle = {$regex: queries.tiltle ,$options: 'i'}
    if (queries?.category) restQueries.category ={ $regex : queries.category,$options:'i'}
    let queryObject = {}
    if(queries?.q){
        delete restQueries.q
        queryObject = {$or : [
            {color :{$regex:queries.q,$options:'i'}},
            {tiltle :{$regex:queries.q,$options:'i'}},
            {category :{$regex:queries.q,$options:'i'}},
            {brand :{$regex:queries.q,$options:'i'}},
            // {description :{$regex:queries.q,$options:'i'}},
        ]}
    }
    const qr = {...formatedQueries, ...restQueries, ...queryObject}
    let queryCommand = Product.find(qr)

    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }

    //Fields Limiting
    if(req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }

    // Pagination
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
    const skip = (page-1) * limit
    queryCommand.skip(skip).limit(limit)
    //  Execute query
    // Số lượng sp thoả mãn điều kiện !== số lượng trả về 1 lần gọi api
    queryCommand.exec(async(err,response) =>{
        if (err) throw new Error(err.message)
        const counts = await Product.find(qr).countDocuments()
        return res.status(200).json({
            success : response ? true : false,
            counts,
            products : response ? response : 'Cannot get products'
            
        })
    })
   

})


// HÀM SỬA SẢN PHẨM
const updateProduct = asyncHanlder(async(req,res)=>{
    const {pid} = req.params
    const files = req?.files
    if (files?.thumb) req.body.thumb = files?.thumb[0]?.path
    if (files?.iamges) req.body.images = files?.images?.map(el => el.path)
    if (req.body && req.body.tiltle) req.body.slug = slugify(req.body.tiltle)
    const updatedProduct = await Product.findByIdAndUpdate(pid,req.body,{new:true})
    return res.status(200).json({
        success : updatedProduct ? true : false,
        mes : updatedProduct ?  'Updated Product' : 'Cannot update products'
    })

})


// HÀM XOÁ SẢN PHẨM
const deleteProcduct = asyncHanlder(async(req,res)=>{
    const {pid} = req.params
    const deletedProcduct = await Product.findByIdAndDelete(pid)
    return res.status(200).json({
        success : deletedProcduct ? true : false,
        mes : deletedProcduct ? 'Delete' : 'Cannot delete products'
    })

})

// HÀM ĐÁNH GIÁ
const ratings = asyncHanlder(async(req,res)=>{
    const {_id} = req.user
    const {star,comment,pid ,updatedAt} = req.body
    if (!star || !pid) throw new Error('Missing Inputs')
    const ratingProduct = await Product.findById(pid)
    const alreadyRating = ratingProduct?.ratings?.find(el => el.postedBy.toString() === _id )
    // console.log(alreadyRating);
    if(alreadyRating){
        // update star & comment
        await Product.updateOne({
            ratings : {$elemMatch :alreadyRating}
        },{
            $set: {"ratings.$.star" : star,"ratings.$.comment":comment,"ratings.$.updatedAt":updatedAt}
        },{new:true})
    }else{
        // add star & comment
        const response = await Product.findByIdAndUpdate(pid,{
            $push :{ratings:{star,comment,postedBy:_id,updatedAt}}
        },{new :true})
    }


    // Sum rating
    const updatedProduct = await Product.findById(pid)
    const ratingCount   = updatedProduct.ratings.length
    const sumRatings = updatedProduct.ratings.reduce((sum, el)=>sum + el.star, 0)
    updatedProduct.totalRating = Math.round(sumRatings *10 /ratingCount)/10
    
    await updatedProduct.save()


    return res.status(200).json({
        success : true , 
        updatedProduct
    })
})

// HÀM UPLOAD ẢNH LÊN CLOUD
const uploadImagesProduct = asyncHanlder(async(req,res)=>{
    const{pid} = req.params
    if (!req.files) throw new Error('Missing Inpus')
    const respone = await Product.findByIdAndUpdate(pid,{$push:{images: {$each: req.files.map(el => el.path)}}},{new:true})
    return res.status(200).json({
        success :  respone ? true : false, 
        updatedProduct : respone ? respone : 'Cannot upload Images product'
    })
})

// HÀM THÊM BIẾN THỂ
const addVarriant = asyncHanlder(async(req,res)=>{
    const{pid} = req.params
    const {tiltle, price, color} = req.body
    const thumb = req?.files?.thumb[0]?.path
    const images = req.files?.images?.map(el => el.path)
    if (!(tiltle && price && color)) throw new Error('Missing inputs')
    const respone = await Product.findByIdAndUpdate(pid,{$push:{varriants: { color, price, tiltle, thumb, images, sku: makeSKU().toUpperCase()}}},{new:true})
    return res.status(200).json({
        success :  respone ? true : false, 
        mes : respone ? 'Added varriant.' : 'Cannot upload Images product'
    })
})



module.exports = {
    createProduct,
    getProduct,
    getAllProduct,
    updateProduct,
    deleteProcduct,
    ratings,
    uploadImagesProduct,
    addVarriant
}