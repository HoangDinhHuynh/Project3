import React,{memo} from "react";
import {formatMoney,renderStarFromNumber} from '../../ultils/helpers' 
import withBase from "hocs/withBase";
import path from "ultils/path";

const ProductCard = ({price,totalRating,tiltle,image,pid, navigate, category}) =>{
    return(
        <div 
        onClick={e => navigate(`${category?.toLowerCase()}/${pid}/${tiltle}`)}
        className="w-1/3 flex-auto px-[10px] mb-[20px] cursor-pointer">
            <div className="flex w-full border">
                <img src={image} alt='products' className="w-[90px] object-contain" />
                <div className="flex flex-col mt-[15px] items-start gap-1 w-full text-xs">
                    <span className="line-clamp-1 capitalize text-sm">{tiltle?.toLowerCase()}</span>
                    <span className="flex h-5">{renderStarFromNumber(totalRating, 14)?.map((el,index) => (
                        <span key={index}>{el}</span>
                    ))}</span>
                    <span>{`${formatMoney(price)} VNĐ`}</span>
                </div>
            </div>
        </div>
    )
}

export default withBase(memo(ProductCard))