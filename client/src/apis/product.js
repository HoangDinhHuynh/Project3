import axios from "../axios";


export const apiGetProducts = (params) => axios({
    url:'/product/getallproduct',
    method: 'get',
    params
})