import { apiGetUserOrders } from 'apis'
import { CustomSelect, InputForm, Pagination } from 'component'
import withBase from 'hocs/withBase'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { createSearchParams, useSearchParams } from 'react-router-dom'
import { statusOrders } from 'ultils/contants'

const History = ({navigate, location}) => {
  
  const [orders, setOrders] = useState(null)
  const [counts, setCounts] = useState(0)
  const [params] = useSearchParams()

  const {register, formState : {errors}, watch, setValue} = useForm()
  const q= watch('q')
  const status= watch('status')
  const fetchOrders = async(params) => { 
    const response = await apiGetUserOrders({
      ...params, 
      limit : process.env.REACT_APP_LIMIT,
    })
    if(response.success) {
      setOrders(response.orders)
      setCounts(response.counts)
    }
   }
   useEffect(() => { 
    const pr = Object.fromEntries([...params])
    fetchOrders(pr)
    },[params])

    const hanldeSearchStatus = ({value}) => { 
      navigate({
        pathname: location.pathname,
        search : createSearchParams({status:value}).toString()   
      })
     }
  return (
    <div className='w-full relative px-4'>
       <header className='text-3xl font-semibold py-4 border-b border-b-blue-200'>
          History
      </header>
      <div className='flex w-full justify-end items-center px-4'>
          <form className='w-[45%] grid grid-cols-2 gap-4'>
              <div className='col-span-1'>
                <InputForm
                  id='q'
                  register={register}
                  errors={errors}
                  fullWidth
                  placeholder='Search Orders by status'
                />
              </div>
              <div className='col-span-1 flex items-center'>
                <CustomSelect
                  options={statusOrders}
                  value={status}
                  onChange={(val) => hanldeSearchStatus(val)}
                  wrapClassname='w-full'
                />
              </div>
          </form>
      </div>
      <table className='table-auto w-full'>
            <thead>
                <tr className='border bg-sky-900 text-white border-white'>
                  <th className='text-center py-2'>#</th>
                  <th className='text-center py-2'>Product</th>
                  <th className='text-center py-2'>Total</th>
                  <th className='text-center py-2'>Status</th>
                  <th className='text-center py-2'>Created At</th>
                  <th className='text-center py-2'>Actions</th>
                </tr>
            </thead>
            <tbody>
              {orders?.map((el,idx) => (
                <tr className='border border-b' key={el._id}>
                    <td className='text-center py-2'>{(( + params.get('page') > 1 ? + params.get('page') - 1 : 0) * process.env.REACT_APP_LIMIT) + idx + 1 }</td>
                    <td className='text-center py-2'>
                      <span className='flex flex-col'>
                        {el.products?.map(item => (<span key={item._id}>
                          {`• ${item.tiltle} - ${item.color}`}
                        </span>))}
                      </span>
                    </td>
                    <td className='text-center py-2'>{el.total + '💲'}</td>
                    <td className='text-center py-2'>{el.status}</td>
                    <td className='text-center py-2'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
                    {/* <td className='text-center py-2'>
                        <span onClick={() => setEditProduct(el)} className='text-blue-500 hover:underline cursor-pointer px-1 inline-block hover:text-orange-500'><FaRegEdit size={20} /></span>
                        <span onClick={() => hanldeDeleteProduct(el._id)} className='text-blue-500 hover:underline cursor-pointer px-1 inline-block hover:text-orange-500'><RiDeleteBin6Line size={20} /></span>
                        <span onClick={() => setCustomizeVarriant(el)} className='text-blue-500 hover:underline cursor-pointer px-1 inline-block hover:text-orange-500'><MdOutlineDashboardCustomize size={20}/></span>
                    </td> */}
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

export default withBase(History)