import React, { useEffect, useState,memo} from "react";
import {ProductCard} from '..'
import { apiGetProducts} from 'apis'

const FeatureProduct = () =>{

    const [products,setProducts] = useState(null)

    const fetchProducts = async () =>{
        const response = await apiGetProducts({limit:9,sort :'-totalRating'})
        // console.log(response)
        if(response.success) setProducts(response.products)
    }
    useEffect(()=>{
        fetchProducts()
    },[])
    return(
        <div className="w-main">
            <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">FEATURE PRODUCTS</h3>
            <div className="flex flex-wrap mt-[15px] mx-[-10px] ">
                {products?.map(el => (
                    <ProductCard 
                    key={el._id}
                    pid={el._id}
                    image={el.thumb}
                    {...el}
                    />
                ))}
            </div>
            <div className="flex justify-between">
                <img 
                src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-bottom-home2_b96bc752-67d4-45a5-ac32-49dc691b1958_600x.jpg?v=1613166661" 
                alt=""
                className="w-[50%] object-contain"
                />
                <div className="flex flex-col justify-between w-[24%]">
                    <img 
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-bottom-home2_400x.jpg?v=1613166661" 
                    alt=""
                    />
                    <img 
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/banner3-bottom-home2_400x.jpg?v=1613166661" 
                    alt=""
                    />

                </div>
                <img 
                src="https://digital-world-2.myshopify.com/cdn/shop/files/banner4-bottom-home2_92e12df0-500c-4897-882a-7d061bb417fd_400x.jpg?v=1613166661" 
                alt=""
                className="w-[24%] object-contain"
                />
            </div>
        </div>
    )
}

export default memo(FeatureProduct)