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