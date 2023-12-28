import axios from "../axios";


export const apiGetProducts = (params) => axios({
    url:'/product/getallproduct',
    method: 'get',
    params
})

export const apiGetProduct = (pid) => axios({
    url:'/product/getproduct/'+pid,
    method: 'get',
    
})

export const apiRatings = (data) => axios({
    url:'/product/ratings',
    method: 'put',
    data
})

export const apiCreateProduct = (data) => axios({
    url:'/product/createproduct',
    method: 'post',
    data
})

export const apiUpdateProduct = (data, pid) => axios({
    url:'/product/updateproduct/' +pid,
    method: 'put',
    data
})

export const apiDeleteProduct = (pid) => axios({
    url:'/product/deleteproduct/' +pid,
    method: 'delete',
})

export const apiAddVarriant = (data, pid) => axios({
    url:'/product/updateproduct/varriant/' +pid,
    method: 'put',
    data
})

export const apiCreateOrder = (data) => axios({
    url:'/order/' ,
    method: 'post',
    data
})