import React,{useCallback, useEffect,useState} from 'react'
import { useParams } from 'react-router-dom'
import { apiGetProduct } from '../../apis/product'
import {Breadcrumb,Button,SelectQuantity} from '../../component'
import Slider from 'react-slick'
import ReactImageMagnify from 'react-image-magnify';
import {formatPrice,formatMoney,renderStarFromNumber} from '../../ultils/helpers'
import { render } from 'react-dom'

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  // autoplay: false,
  // autoplaySpeed: 3500,
  // pauseOnHover: false
};

const DetailProduct = () => {

  const {pid ,tiltle ,category} = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  // console.log(pid , tiltle) 
  const fetchProductData = async () => {  
    const response = await apiGetProduct(pid)
    if (response.success) setProduct(response.productData)
   }
  useEffect(() => { 
    if(pid) fetchProductData()
   },[pid])

  const handleQuantity = useCallback((number) => { 
    if(!Number(number) || Number(number) < 1) {
      return
    } else setQuantity(number)
    
   },[quantity])
   const handleChangeQuantity = useCallback((flag) => { 
      if(flag === 'minus' && quantity === 1)  return
      if(flag === 'minus') setQuantity(prev => +prev - 1)
      if(flag === 'plus') setQuantity(prev => +prev + 1)
    },[quantity])
  return (
    <div className='w-full'>
      <div className='h-[81px] flex justify-center items-center bg-gray-100 '>
          <div className='w-main'>
            <h3 className='font-semibold'>{tiltle}</h3>
            <Breadcrumb tiltle={tiltle} category={category} />
          </div>
      </div>
      <div className='w-main m-auto mt-4 flex'>
        <div className='flex flex-col gap-4 w-2/5'>
          <div className='h-[458px] w-[458px] border'>
            <ReactImageMagnify {...{
              smallImage: {
                alt: 'Wristwatch by Ted Baker London',
                isFluidWidth: true,
                src: product?.thumb
              },
              largeImage: {
                src: product?.thumb,
                width: 1200,
                height: 1200
              }
            }} />
          </div>
              <div className='w-[458px]'>
                <Slider className='images-slider flex gap-2'{...settings}>
                  {product?.images?.map(el => (
                    <div key={el} className=''>
                      <img src={el} alt='sub-product' className='h-[143px] border object-contain' />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
            <div className='w-2/5 flex flex-col gap-4'>
              <div className='flex items-center justify-between'>
                <h2 className='text-[30px] font-semibold'>{`${formatMoney(formatPrice(product?.price))} VNĐ`}</h2>
                <span className='text-sm text-main'>{`Storage : ${product?.quantity}`}</span>
              </div>
              <div className='flex items-center gap-1'>
                {renderStarFromNumber(product?.totalRating)?.map((el,index) => (<span key={index}>{el}</span>))}
                <span className='text-sm text-main italic'>{`(Sold : ${product?.sold} items)`}</span>
              </div>
              <ul className='text-sm text-gray-500 list-square pl-4'>
                {product?.description?.map(el => (<li className='leading-6' key={el}>{el}</li>))}
              </ul>
              <div className='flex flex-col gap-8'>
                <SelectQuantity 
                quantity={quantity} 
                handleQuantity={handleQuantity}
                handleChangeQuantity={handleChangeQuantity}
                />
                <Button fw>
                  Add to Cart
                </Button>
              </div>
            </div>
            <div className='border border-green-500 w-1/5'>
              information
            </div>
      </div>
      <div className='h-[500px]'></div>
    </div>
  )
}

export default DetailProduct