const Product = require('../models/product')
const asyncHanlder = require('express-async-handler')
const data = require('../../data/data2.json')



// HÀM CHÈN DỮ LIỆU
const insertProduct = asyncHanlder(async(req,res)=>{
    const respone = await Product.findByIdAndUpdate(pid,{$push:{images: {$each: req.files.map(el => el.path)}}},{new:true})
    return res.status(200).json({
        status :  respone ? true : false, 
        updatedProduct : respone ? respone : 'Cannot upload Images product'
    })
})


module.exports = insertProduct