import React, { useEffect } from "react";
import {ProductCard} from './'
import { apiGetProducts} from '../apis'

const FeatureProduct = () =>{

    const fetchProducts = async () =>{
        const response = await apiGetProducts({limit:9,totalRating:5})
    }
    useEffect(()=>{
        fetchProducts()
    },[])
    return(
        <div className="w-full">
            <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">FEATURE PRODUCTS</h3>
        </div>
    )
}

export default FeatureProduct