import React, { useEffect,useState } from 'react'
import { InputForm,Pagination } from 'component'
import { useForm } from 'react-hook-form'
import { apiGetProducts } from 'apis/product'
import { useSearchParams, createSearchParams, useNavigate, useLocation } from 'react-router-dom'
import moment from 'moment'
import useDebounce from 'hooks/useDebounce'

const ManageProducts = () => {

  const location = useLocation()
  const navigate = useNavigate() 
  const [params] = useSearchParams()
  const {register, formState:{errors}, handleSubmit, reset, watch} = useForm() 
  const [products, setProducts] = useState(null) 
  const [counts, setCounts] = useState(0)

 
  const fetchProducts = async(params) => { 
    const response = await apiGetProducts({...params, limit : process.env.REACT_APP_LIMIT})
    if(response.success) {
      setCounts(response.counts)
      setProducts(response.products)
    }
   }
  const queryDebounce = useDebounce(watch('q'), 800) 
  useEffect(() => { 
    if(queryDebounce) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({q: queryDebounce}).toString()
      }) 
    }else navigate({
      pathname: location.pathname,
    }) 
   },[queryDebounce])

  useEffect(() => { 
      const searchParams = Object.fromEntries([...params])
      fetchProducts(searchParams)
   },[params, queryDebounce])
  return (
    <div className='w-full px-4 flex flex-col gap-4 relative'>
      <div className='h-[69px] w-full'></div>
      <div className='p-4 border-b w-full bg-gray-100 flex justify-between items-center fixed top-0'>
        <h1 className='text-3xl font-bold tracking-tight '>Manage products</h1>
      </div>
      <div className='flex w-full justify-end items-center px-4'>
          <form className='w-[45%]'>
              <InputForm
                id='q'
                register={register}
                errors={errors}
                fullWidth
                placeholder='Search product by tiltle, description,...'
              />
          </form>
      </div>
      <table className='table-auto'>
            <thead>
                <tr className='border bg-sky-900 text-white border-white'>
                  <th className='text-center py-2'>Order</th>
                  <th className='text-center py-2'>Thumb</th>
                  <th className='text-center py-2'>Tiltle</th>
                  <th className='text-center py-2'>Brand</th>
                  <th className='text-center py-2'>Category</th>
                  <th className='text-center py-2'>Price</th>
                  <th className='text-center py-2'>Quantity</th>
                  <th className='text-center py-2'>Sold</th>
                  <th className='text-center py-2'>Color</th>
                  <th className='text-center py-2'>Ratings</th>
                  <th className='text-center py-2'>UpdateAt</th>
                </tr>
            </thead>
            <tbody>
              {products?.map((el,idx) => (
                <tr className='border border-b' key={el._id}>
                    <td className='text-center py-2'>{(( + params.get('page') > 1 ? + params.get('page') - 1 : 0) * process.env.REACT_APP_LIMIT) + idx + 1 }</td>
                    <td className='text-center py-2'>
                      <img src={el.thumb} alt='thumb' className='w-12 h-12 object-cover'/>
                    </td>
                    <td className='text-center py-2'>{el.tiltle}</td>
                    <td className='text-center py-2'>{el.brand}</td>
                    <td className='text-center py-2'>{el.category}</td>
                    <td className='text-center py-2'>{el.price}</td>
                    <td className='text-center py-2'>{el.quantity}</td>
                    <td className='text-center py-2'>{el.sold}</td>
                    <td className='text-center py-2'>{el.color}</td>
                    <td className='text-center py-2'>{el.totalRating}</td>
                    <td className='text-center py-2'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
                </tr>
              ))}
            </tbody>
      </table>
      <div className='w-full flex justify-end my-8'>
        <Pagination totalCount={counts}/>
      </div>
    </div>
  )
}

export default ManageProducts