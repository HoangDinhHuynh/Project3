import React,{useState} from "react";
import {formatMoney } from "../ultils/helpers"
import label from '../assets/label.webp'
import labelTrend from '../assets/label-trend.png'
import {renderStarFromNumber} from '../ultils/helpers'
import {SelectOption} from './'
import icons from '../ultils/icon'

const {AiFillEye,BiMenu, BsFillSuitHeartFill}  = icons


const Product = ({productData, isNew}) =>{
    const [isShowOption, setIsShowOption] = useState(false)
    return(
        <div className="w-full text-base px-[10px]">
            <div 
            className="w-full border rounded p-[15px] flex flex-col items-center"
            onMouseEnter={e => {
                e.stopPropagation()
                setIsShowOption(true)
            }}
            onMouseLeave={e => {
                e.stopPropagation()
                setIsShowOption(false)
            }}
            >
                <div className="w-full relative">
                    {isShowOption && <div className='absolute bottom-0 left-0 right-0 flex justify-center gap-2 animate-slide-top'>
                        <SelectOption icon={<AiFillEye />}/>
                        <SelectOption icon={<BiMenu />}/>
                        <SelectOption icon={<BsFillSuitHeartFill />}/>
                    </div>}
                    <img src={productData?.thumb || 'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png'}
                        alt=""
                        className="w-[274px] h-[274px] object-cover" />
                    <img src={isNew ? label : labelTrend} alt="label" className={`absolute w-[100px] top-[-31px] left-[-39px] object-contain`} />
                    <span className="font-bold absolute text-white top-[-15px] left-[-10px]">{isNew ? 'New' : 'Trend'}</span>
                </div>
                <div className="flex flex-col mt-[15px] items-start gap-1 w-full">
                    <span className="line-clamp-1">{productData?.tiltle}</span>
                    <span className="flex h-[24px]">{productData?.totalRating ? renderStarFromNumber(productData?.totalRating) : 'chưa có đánh giá'}</span>
                    <span>{`${formatMoney(productData?.price)} VNĐ`}</span>
                </div>
            </div>
        </div>
    )
}

export default Product