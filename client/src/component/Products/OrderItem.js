import SelectQuantity from 'component/Common/SelectQuantity'
import React, { memo, useState } from 'react'
import { useSelector } from 'react-redux'
import { formatMoney } from 'ultils/helpers'

const OrderItem = ({el}) => {

    const { current } = useSelector(state => state.user)
    const [quantity, setQuantity] = useState(0)
    const handleQuantity = (number) => {
      if (+number > 1) setQuantity(number)
    }
    const handleChangeQuantity = (flag) => {
        if (flag === 'minus' && quantity === 1) return
        if (flag === 'minus') setQuantity(prev => +prev - 1)
        if (flag === 'plus') setQuantity(prev => +prev + 1)
      }
      
  return (
    <div className='font-bold grid-cols-10 py-3 grid w-main mx-auto border-b'>
            <span className='col-span-6 w-full text-center'>
              <div className='flex gap-2'>
                <img src={el.thumbnail} alt='thumb' className='w-28 h-28 object-cover rounded-md' />
                <div className='flex flex-col items-start gap-1'>
                  <span className='text-sm text-main'>{el.tiltle}</span>
                  <span className='text-[12px] font-main'>{el.color}</span>
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
              <span className='text-lg'>{formatMoney(el.price) + ' VNĐ'}</span>
            </span>
          </div>
  )
}

export default memo(OrderItem)