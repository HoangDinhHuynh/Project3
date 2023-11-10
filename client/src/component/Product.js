import React from "react";
import {formatMoney } from "../ultils/helpers"
import label from '../assets/label.webp'
import labelTrend from '../assets/label-trend.png'


const Product = ({productData, isNew}) =>{
    return(
        <div className="w-full text-base px-[10px]">
            <div className="w-full border rounded p-[15px] flex flex-col items-center">
                <div className="w-full relative">
                <img src={productData?.thumb || 'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png'}
                    alt=""
                    className="w-[243px] h-[243px] object-cover" />
                <img src={isNew? label : labelTrend} className={`absolute w-[100px] top-[-31px] left-[-39px] object-contain`}/>    
                <span className="font-bold absolute text-white top-[-15px] left-[-10px]">{isNew? 'New':'Trend'}</span>    
                </div>
                <div className="flex flex-col mt-[15px] items-start gap-1 w-full">
                    <span className="line-clamp-1">{productData?.tiltle}</span>
                    <span>{`${formatMoney(productData?.price)} VNĐ`}</span>
                </div>
            </div>
        </div>
    )
}

export default Product