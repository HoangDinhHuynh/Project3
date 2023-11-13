import React,{useEffect,useState} from 'react'
import { useParams } from 'react-router-dom'
import { apiGetProduct } from '../../apis/product'
import {Breadcrumb} from '../../component'

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
    </div>
  )
}

export default DetailProduct