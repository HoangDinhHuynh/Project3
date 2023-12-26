import SelectQuantity from 'component/Common/SelectQuantity'
import React, { memo, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { formatMoney } from 'ultils/helpers'
import { updateCart } from 'store/user/userSlice'
import withBase from 'hocs/withBase'


const OrderItem = ({dispatch, color, dfQuantity = 1, price, tiltle, thumbnail, pid}) => {

    const { current } = useSelector(state => state.user)
    const [quantity, setQuantity] = useState(() => dfQuantity)
    const handleQuantity = (number) => {
      if (+number > 1) setQuantity(number)
    }
    const handleChangeQuantity = (flag) => {
        if (flag === 'minus' && quantity === 1) return
        if (flag === 'minus') setQuantity(prev => +prev - 1)
        if (flag === 'plus') setQuantity(prev => +prev + 1)
    }
    useEffect(() => { 
      dispatch(updateCart({pid , quantity, color}))
     },[quantity])
      
  return (
    <div className='font-bold grid-cols-10 py-3 grid w-main mx-auto border-b'>
            <span className='col-span-6 w-full text-center'>
              <div className='flex gap-2 px-4 py-2'>
                <img src={thumbnail } alt='thumb' className='w-28 h-28 object-cover rounded-md' />
                <div className='flex flex-col items-start gap-1'>
                  <span className='text-sm text-main'>{tiltle}</span>
                  <span className='text-[12px] font-main'>{color}</span>
                </div>
              </div>
            </span>
            <span className='col-span-1 w-full text-center'>
              <div className='flex items-center h-full'>
                <SelectQuantity
                  quantity={quantity}
                  handleQuantity={handleQuantity}
                  handleChangeQuantity={handleChangeQuantity}
                />
              </div>
            </span>
            <span className='col-span-3 w-full h-full flex justify-center items-center text-center'>
              <span className='text-lg'>{formatMoney(price*quantity) + ' VNĐ'}</span>
            </span>
          </div>
  )
}

export default withBase(memo(OrderItem))