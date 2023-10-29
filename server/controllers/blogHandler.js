const { model } = require('mongoose')
const Blog = require('../models/blog')
const asyncHanlder = require('express-async-handler')


// HÀM TẠO BÀI ĐĂNG
const createNewBlog = asyncHanlder(async(req,res)=>{
    const {tiltle,description,category} = req.body
    if (!tiltle || !description || ! category) throw new Error('Missing Inpusts')
    const response = await Blog.create(req.body)
    return res.json({
        success : response? true : false,
        createdBlog : response ? response :'Cannot create new blog'
    })
})


// HÀM SỬA BÀI DĂNG
const updateBlog = asyncHanlder(async(req,res)=>{
    const {bid} = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing Inpusts')
    const response = await Blog.findByIdAndUpdate(bid, req.body,{new:true})
    return res.json({
        success : response? true : false,
        updatedBlog : response ? response :'Cannot update blog'
    })
})


// HÀM LẤY BÀI DĂNG
const getBlogs = asyncHanlder(async(req,res)=>{
    const {bid} = req.params
    const response = await Blog.find()
    return res.json({
        success : response? true : false,
        updatedBlog : response ? response :'Cannot get blog'
    })
})


// HÀM LIKE VÀ DISLIKE
const likeBlog = asyncHanlder(async(req,res)=>{
    const {_id} = req.user
    const {bid} = req.body
    if (!bid) throw new Error('Missing inputs')
    const blog = await Blog.findById(bid)
    const alreadyDisliked = blog?.dislikes?.find(el => el.toString() === _id) 
    if (alreadyDisliked){
        const response = await Blog.findByIdAndUpdate(bid,{$pull:{dislikes:_id}},{new:true})
        return res.json({
            success : response ? true : false,
            rs : response
        }) 
    }
    const isLiked = blog?.likes?.find(el => el.toString() === _id)
    if (isLiked){
        const response = await Blog.findByIdAndUpdate(bid,{$pull:{likes:_id}},{new:true})
        return res.json({
            success : response ? true : false,
            rs : response
        })
    }else{
        const response = await Blog.findByIdAndUpdate(bid,{$push:{likes:_id}},{new:true})
        return res.json({
            success : response ? true : false,
            rs : response
        })
    }
})

module.exports ={
    createNewBlog,
    updateBlog,
    getBlogs,
    likeBlog
}