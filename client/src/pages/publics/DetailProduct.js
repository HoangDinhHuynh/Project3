import React,{useCallback, useEffect,useState} from 'react'
import { useParams } from 'react-router-dom'
import { apiGetProduct,apiGetProducts } from '../../apis/product'
import {Breadcrumb,Button,SelectQuantity,ProductExtrainfoitem,ProductInfomation,CustomSlider} from '../../component'
import Slider from 'react-slick'
import ReactImageMagnify from 'react-image-magnify';
import {formatPrice,formatMoney,renderStarFromNumber} from '../../ultils/helpers'
import { productExtraInfomation} from '../../ultils/contants'
import  DOMPurify from 'dompurify';



const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  // autoplay: false,
  // autoplaySpeed: 3500,
  // pauseOnHover: false
};

const DetailProduct = () => {

  const {pid ,tiltle ,category} = useParams()
  const [product, setProduct] = useState(null)
  const [currentImage, setCurrentImage] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [relatedProducts, setRelatedProducts] = useState(null)
  const [update, setUpdate] = useState(false)
  // console.log(pid , tiltle) 
  const fetchProductData = async () => {  
    const response = await apiGetProduct(pid)
    if (response.success) {
      setProduct(response.productData)
      setCurrentImage(response.productData?.thumb)
    }
   }
  const fetchProducts = async() => { 
    const response = await apiGetProducts({category})
    if (response.success) setRelatedProducts(response.products)
   }
  useEffect(() => { 
    if(pid){
      fetchProductData()
      fetchProducts()
    }
    window.scrollTo(0,0)
   },[pid])
   useEffect(() => { 
    if(pid)   fetchProductData()
   },[update])

   const reRender = useCallback(() => { 
      setUpdate(!update)
    },[update])

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

    const handleClickImage = (e,el) => { 
      e.stopPropagation()
      setCurrentImage(el)
     }
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
          <div className='h-[458px] w-[458px] border overflow-hidden'>
            <ReactImageMagnify {...{
              smallImage: {
                alt: 'Wristwatch by Ted Baker London',
                isFluidWidth: true,
                src: currentImage
              },
              largeImage: {
                src: currentImage,
                width: 1200,
                height: 1200
              }
            }} />
          </div>
              <div className='w-[458px]'>
                <Slider className='images-slider flex gap-2'{...settings}>
                  {product?.images?.map(el => (
                    <div key={el} className=''>
                      <img onClick={e => handleClickImage(e,el)} src={el} alt='sub-product' className='cursor-pointer h-[135px] w-[135px] border object-contain' />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
            <div className='w-2/5 pr-[24px] flex flex-col gap-4'>
              <div className='flex items-center justify-between'>
                <h2 className='text-[30px] font-semibold'>{`${formatMoney(formatPrice(product?.price))} VNĐ`}</h2>
                <span className='text-sm text-main'>{`Storage : ${product?.quantity}`}</span>
              </div>
              <div className='flex items-center gap-1'>
                {renderStarFromNumber(product?.totalRating)?.map((el,index) => (<span key={index}>{el}</span>))}
                <span className='text-sm text-main italic'>{`(Sold : ${product?.sold} items)`}</span>
              </div>
              <ul className='text-sm text-gray-500 list-square pl-4'>
                {product?.description?.length > 1 && product?.description?.map(el => (<li className='leading-6' key={el}>{el}</li>))}
                {product?.description?.length === 1 && <div className='text-sm' dangerouslySetInnerHTML={{ __html : DOMPurify.sanitize(product?.description[0])}}></div>}
              </ul>
              <div className='flex flex-col gap-8'>
                <div className='flex items-center gap-4'>
                <span className='font-semibold'>Quantity</span>
                <SelectQuantity 
                quantity={quantity} 
                handleQuantity={handleQuantity}
                handleChangeQuantity={handleChangeQuantity}
                />
                </div>
                <Button fw>
                  Add to Cart
                </Button>
              </div>
            </div>
            <div className='w-1/5'>
              {productExtraInfomation.map(el=>(
                <ProductExtrainfoitem 
                key={el.id}
                tiltle={el.tiltle}
                icon={el.icon}
                sub={el.sub}
                />
              ))}
            </div>
      </div>
      <div className='w-main m-auto mt-8'>
        <ProductInfomation
        pid={product?._id} 
        totalRating={product?.totalRating} 
        ratings={product?.ratings}
        nameProduct={product?.tiltle}
        reRender={reRender}
        />
      </div>
        <div className='w-main m-auto mt-8'>
            <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">OTHER CUSTOMERS ALSO LIKED :</h3>
            <div className='pt-10'>
              <CustomSlider  normal={true} products={relatedProducts}/> 
            </div>
        </div>
      <div className='h-[100px] w-full'></div>
    </div>
  )
}

export default DetailProduct