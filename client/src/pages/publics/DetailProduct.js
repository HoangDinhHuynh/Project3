import React,{useEffect,useState} from 'react'
import { useParams } from 'react-router-dom'
import { apiGetProduct } from '../../apis/product'
import {Breadcrumb} from '../../component'
import Slider from 'react-slick'
import ReactImageMagnify from 'react-image-magnify';

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
  // console.log(pid , tiltle) 
  const fetchProductData = async () => {  
    const response = await apiGetProduct(pid)
    if (response.success) setProduct(response.productData)
   }
  useEffect(() => { 
    if(pid) fetchProductData()
   },[pid])
  return (
    <div className='w-full'>
      <div className='h-[81px] flex justify-center items-center bg-gray-100 '>
          <div className='w-main'>
            <h3>{tiltle}</h3>
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
            <div className='border border-red-500 w-2/5'>
              price
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