import React, { useEffect, useState,memo } from "react";
import moment from 'moment'
import icons from '../../ultils/icon'
import { apiGetProducts } from "../../apis/product";
import {formatMoney,renderStarFromNumber,secondsToHms } from "../../ultils/helpers"
import {Countdown} from '..'


const {BsStarFill,BiMenu} = icons
let idInterval

const DealDaily = () =>{

    const [dealDaily,setDealDaily] = useState(null)
    const [hour,setHour] = useState(0)
    const [minute,setMinute] = useState(0)
    const [second,setSecond] = useState(0)
    const [expireTime,setExpireTime] = useState(false)

    const fetchDealDaily = async() => {
        const response = await apiGetProducts({limit:1,page:Math.round(Math.random()*1),totalRating:5})
        if (response.success) {
            setDealDaily(response.products[0])
            const today = `${moment().format('MM/DD/YYYY')} 5:00:00`
            const seconds = new Date(today).getTime() -new Date().getTime() + 24 *3600 * 1000
            const number = secondsToHms(seconds)
            setHour(number.h)
            setMinute(number.m)
            setSecond(number.s)
        }else{
            setHour(0)
            setMinute(59)
            setSecond(59) 
        }
    }

    // useEffect(()=>{
    //     fetchDealDaily()
    // },[])
    useEffect(() => {
        idInterval && clearInterval(idInterval)
        fetchDealDaily()
    }, [expireTime])
    useEffect(()=>{
        idInterval = setInterval(()=>{
            // console.log(idInterval)
            if (second>0) setSecond(prev => prev-1)
            else{
                if(minute > 0) {
                    setMinute(prev => prev-1)
                    setSecond(59)
                }else{
                    if(hour > 0){
                        setHour(prev => prev -1 )
                        setMinute(59)
                        setSecond(59)
                    }else{
                        setExpireTime(!expireTime)
                    }
                }

            }
        },1000)
        return () => {
            clearInterval(idInterval)
        }
    },[second, minute, hour, expireTime])
    return(
        <div className="border w-full flex-auto p-4">
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
                <span className="flex h-[24px]">{dealDaily?.totalRating ? renderStarFromNumber(dealDaily?.totalRating ,20).map((el,index) => (
                    <span key={index}>{el}</span>
                ))  : 'chưa có đánh giá'}</span>
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
                className="flex gap-2 items-center rounded-md justify-center w-full bg-main hover:bg-gray-800 hover:text-white font-medium py-2 transition-colors ease-out delay-100 duration-300"
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