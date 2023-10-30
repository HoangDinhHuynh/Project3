const { model } = require('mongoose')
const Blog = require('../models/blog')
const asyncHanlder = require('express-async-handler')


// HÀM TẠO BÀI ĐĂNG
const createNewBlog = asyncHanlder(async(req,res)=>{
    const {tiltle,description,category} = req.body
    if (!tiltle || !description || !category) throw new Error('Missing Inpusts')
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
const getAllBlogs = asyncHanlder(async(req,res)=>{
    const {bid} = req.params
    const response = await Blog.find()
    return res.json({
        success : response? true : false,
        updatedBlog : response ? response :'Cannot get blog'
    })
})


// HÀM LIKE 
const likeBlog = asyncHanlder(async(req,res)=>{
    const {_id} = req.user
    const {bid} = req.params
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


// HÀM DISLIKE
const dislikeBlog = asyncHanlder(async(req,res)=>{
    const {_id} = req.user
    const {bid} = req.params
    if (!bid) throw new Error('Missing inputs')
    const blog = await Blog.findById(bid)
    const alreadyLiked = blog?.likes?.find(el => el.toString() === _id) 
    if (alreadyLiked){
        const response = await Blog.findByIdAndUpdate(bid,{$pull:{likes:_id}},{new:true})
        return res.json({
            success : response ? true : false,
            rs : response
        }) 
    }
    const isDisliked = blog?.dislikes?.find(el => el.toString() === _id)
    if (isDisliked){
        const response = await Blog.findByIdAndUpdate(bid,{$pull:{dislikes:_id}},{new:true})
        return res.json({
            success : response ? true : false,
            rs : response
        })
    }else{
        const response = await Blog.findByIdAndUpdate(bid,{$push:{dislikes:_id}},{new:true})
        return res.json({
            success : response ? true : false,
            rs : response
        })
    }
})


// HÀM LẤY MỘT BLOG
const neededFields = 'firstname lastname'
const getBlog = asyncHanlder(async(req,res)=>{
    const {bid} = req.params
    const blog = await Blog.findByIdAndUpdate(bid,{$inc:{numberViews:1}},{new:true})
        .populate('likes', neededFields )
        .populate('dislikes', neededFields )
    return res.json({
        success : blog ? true : false,
        rs : blog
    })
})


// HÀM XOÁ MỘT BLOG
const deleteBlog = asyncHanlder(async(req,res)=>{
    const {bid} = req.params
    const blog = await Blog.findByIdAndDelete(bid)
    return res.json({
        success : blog ? true : false,
        deletedBlog : blog ? blog : "Cannot delete blog"
    })
})



module.exports ={
    createNewBlog,
    updateBlog,
    getAllBlogs,
    likeBlog,
    dislikeBlog,
    getBlog,
    deleteBlog
}