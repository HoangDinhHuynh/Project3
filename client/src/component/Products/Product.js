import React,{useState,memo} from "react";
import {formatMoney,renderStarFromNumber } from "../../ultils/helpers"
import label from 'assets/label.webp'
import labelTrend from 'assets/label-trend.png'
import {SelectOption} from '..'
import icons from 'ultils/icon'
import { Link } from "react-router-dom";
import withBase from "hocs/withBase";
import { showModal } from "store/app/appSlice";
import { DetailProduct } from "pages/publics";
import { apiUpdateCart } from "apis";
import { toast } from "react-toastify";
import { getCurrent } from "store/user/asyncAction";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import path from "ultils/path";
import { BsCartCheckFill,BsCartPlusFill } from "react-icons/bs";

const {AiFillEye, BsFillSuitHeartFill}  = icons


const Product = ({productData, isNew , normal, navigate, dispatch}) =>{
    const [isShowOption, setIsShowOption] = useState(false)
    const {current} = useSelector(state => state.user)
    const handleClickOptions = async(e,flag) => { 
        e.stopPropagation()
        if(flag === 'CART') {
            if(!current) return Swal.fire({
                title : 'Almost...',
                text : 'Please login first',
                icon: 'info',
                cancelButtonText : 'Not now!',
                showCancelButton : true,
                showConfirmButton: true,
                confirmButtonText: 'Go login page'
            }).then((rs)=>{
                if(rs.isConfirmed) navigate(`/${path.LOGIN}`)
            })
            const response = await apiUpdateCart({pid:productData._id, color: productData.color})
            if(response.success) {
                toast.success(response.mes)
                dispatch(getCurrent()) 
            }
            else toast.error(response.mes)
        }
        if(flag === 'WISHLIST') console.log("Wishlist")
        if(flag === 'QUICK_VIEW') {
            dispatch(showModal({isShowModal: true, modalChildren: <DetailProduct data={{pid: productData?._id, category: productData?.category}} isQuickView/>}))
        }
     }
    return(
        <div className="w-full text-base px-[10px]">
            <div 
            className="w-full border rounded p-[15px] flex flex-col items-center"
            onClick={e => navigate(`${productData?.category?.toLowerCase()}/${productData?._id}/${productData?.tiltle}`)}
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
                        <span title="Quick view" onClick={(e) => handleClickOptions(e,'QUICK_VIEW')}><SelectOption icon={<AiFillEye />}/></span>
                        {current?.cart?.some(el => el.product === productData._id)
                        ? <span title="Added to cart" ><SelectOption icon={<BsCartCheckFill color="green"/>}/></span>
                        : <span title="Add to cart" onClick={(e) => handleClickOptions(e,'CART')}><SelectOption icon={<BsCartPlusFill />}/></span>}
                        <span title="Add to wishlist" onClick={(e) => handleClickOptions(e,'WISHLIST')}><SelectOption icon={<BsFillSuitHeartFill />}/></span>
                    </div>}
                    <img src={productData?.thumb || 'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png'}
                        alt=""
                        className="w-[274px] h-[274px] object-cover" />
                    {!normal && <img src={isNew ? label : labelTrend} alt="label" className={`absolute w-[100px] top-[-31px] left-[-39px] object-contain`} />}
                    <span className="font-bold absolute text-white top-[-15px] left-[-10px]">{isNew ? 'New' : 'Trend'}</span>
                </div>
                <div className="flex flex-col mt-[15px] items-start gap-1 w-full">
                    <span className="line-clamp-1">{productData?.tiltle}</span>
                    <span className="flex h-[24px]">{productData?.totalRating ? 
                    renderStarFromNumber(productData?.totalRating, 14)?.map((el,index) => (
                        <span key={index}>{el}</span>
                    )) 
                    : 'chưa có đánh giá'}</span>
                    <span>{`${formatMoney(productData?.price)} VNĐ`}</span>
                </div>
            </div>
        </div>
    )
}

export default withBase(Product)