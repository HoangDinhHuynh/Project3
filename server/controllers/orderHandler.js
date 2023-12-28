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
    const data = {...products, total, orderBy: _id}
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
    const queries = {...req.query}
    const {_id} = req.user
    // Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit','sort','page','fields']
    excludeFields.forEach(el => delete queries[el])
    
    
    // Formats lại các operators cho đúng cú pháp của mongoose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, macthedEl => `$${macthedEl}`) 
    const restQueries =  JSON.parse(queryString)
    
    // Filtering
    let formatedQueries = {} 
    // if (queries?.color) {
    //     delete restQueries.color
    //     const colorQuery = queries.color?.split(',').map(el=>({color :{$regex:el,$options:'i'}}))
    //     formatedQueries = {$or : colorQuery}
    // }
    // if (queries?.tiltle) restQueries.tiltle = {$regex: queries.tiltle ,$options: 'i'}
    // if (queries?.category) restQueries.category ={ $regex : queries.category,$options:'i'}
    // let queryObject = {}
    // if(queries?.q){
    //     delete restQueries.q
    //     queryObject = {$or : [
    //         {color :{$regex:queries.q,$options:'i'}},
    //         {tiltle :{$regex:queries.q,$options:'i'}},
    //         {category :{$regex:queries.q,$options:'i'}},
    //         {brand :{$regex:queries.q,$options:'i'}},
    //         // {description :{$regex:queries.q,$options:'i'}},
    //     ]}
    // }
    const qr = {...formatedQueries, orderBy : _id}
    let queryCommand = Order.find(qr)

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
        const counts = await Order.find(qr).countDocuments()
        return res.status(200).json({
            success : response ? true : false,
            counts,
            orders : response ? response : 'Cannot get products'
            
        })
    })
   

})



// HÀM LẤY TẤT CẢ ĐƠN HÀNG (ADMIN)
const getAllOrder = asyncHanlder(async(req,res)=>{
    const queries = {...req.query}
    // Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit','sort','page','fields']
    excludeFields.forEach(el => delete queries[el])
    
    
    // Formats lại các operators cho đúng cú pháp của mongoose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, macthedEl => `$${macthedEl}`) 
    const restQueries =  JSON.parse(queryString)
    
    // Filtering
    let formatedQueries = {} 
    // if (queries?.color) {
    //     delete restQueries.color
    //     const colorQuery = queries.color?.split(',').map(el=>({color :{$regex:el,$options:'i'}}))
    //     formatedQueries = {$or : colorQuery}
    // }
    // if (queries?.tiltle) restQueries.tiltle = {$regex: queries.tiltle ,$options: 'i'}
    // if (queries?.category) restQueries.category ={ $regex : queries.category,$options:'i'}
    // let queryObject = {}
    // if(queries?.q){
    //     delete restQueries.q
    //     queryObject = {$or : [
    //         {color :{$regex:queries.q,$options:'i'}},
    //         {tiltle :{$regex:queries.q,$options:'i'}},
    //         {category :{$regex:queries.q,$options:'i'}},
    //         {brand :{$regex:queries.q,$options:'i'}},
    //         // {description :{$regex:queries.q,$options:'i'}},
    //     ]}
    // }
    const qr = { ...formatedQueries}
    let queryCommand = Order.find(qr)

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
        const counts = await Order.find(qr).countDocuments()
        return res.status(200).json({
            success : response ? true : false,
            counts,
            orders : response ? response : 'Cannot get products'
            
        })
    })
   

})

module.exports ={
    createOrder,
    updateStatus,
    getUserOrder,
    getAllOrder
}
