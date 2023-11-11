import React, { useEffect, useState,memo } from "react";
import icons from '../ultils/icon'
import { apiGetProducts } from "../apis/product";
import {formatMoney,renderStarFromNumber } from "../ultils/helpers"
import {Countdown} from './'


const {BsStarFill,BiMenu} = icons


const DealDaily = () =>{

    const [dealDaily,setDealDaily] = useState(null)
    const [hour,setHour] = useState(0)
    const [minute,setMinute] = useState(0)
    const [second,setSecond] = useState(0)

    const fetchDealDaily = async() => {
        const response = await apiGetProducts({limit:1,page:2,totalRating:5})
        if (response.success) setDealDaily(response.products[0])
    }

    useEffect(()=>{
        fetchDealDaily()
    },[])
    
    return(
        <div className="border w-full flex-auto p-4 w-full">
            <div className="flex items-center justify-between">
                <span className="flex-1 flex justify-center"><BsStarFill size={20} color="#DD1111"/></span>
                <span className="flex-8 font-semibold text-[20px] flex justify-center text-gray-700">DEAL DAILY</span>
                <span className="flex-1"></span>
            </div>
            <div className="w-full flex flex-col items-center pt-8 px-4 gap-2">
                <img
                    src={dealDaily?.thumb || 'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png'}
                    alt=""
                    className="w-full object-contain" />
                <span className="line-clamp-1 text-center">{dealDaily?.tiltle}</span>
                <span className="flex h-[24px]">{dealDaily?.totalRating ? renderStarFromNumber(dealDaily?.totalRating ,20) : 'chưa có đánh giá'}</span>
                <span>{`${formatMoney(dealDaily?.price)} VNĐ`}</span>
            </div>
            <div className="px-4 mt-8">
                <div className="flex justify-center gap-2 items-center mb-4">
                    <Countdown unit={'Hours'} number={hour}/>
                    <Countdown unit={'Minutes'} number={minute}/>
                    <Countdown unit={'Seconds'} number={second}/>
                </div>
                <button 
                type='button'
                className="flex gap-2 items-center justify-center w-full bg-main hover:bg-gray-800 hover:text-white font-medium py-2"
                >
                    <BiMenu />
                    <span>
                        Options
                    </span>
                </button>
            </div>
        </div>
    )
}

export default memo(DealDaily)