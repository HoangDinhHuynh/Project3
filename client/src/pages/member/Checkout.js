import React from 'react'
import payment from 'assets/payment.svg'
import { useSelector } from 'react-redux'
import { formatMoney } from 'ultils/helpers'
import { Paypal } from 'component'

const Checkout = () => {

    const {currentCart} = useSelector(state => state.user)
 
  return (
    <div className='p-8 w-full grid grid-cols-10 h-full max-h-screen overflow-y-auto gap-6'>
      <div className='w-full flex justify-center items-center col-span-4'>
        <img src={payment} alt='payment' className='h-[70%] object-contain'/>
      </div>
      <div className='flex w-full flex-col justify-center items-center col-span-6 gap-6'>
        <h2 className='text-3xl mb-6 font-bold'>Checkout your order</h2>
        <table className='table-auto w-full'>
          <thead>
            <tr className='border bg-gray-200 p-2'>
              <th  className='text-left p-2'>Products</th>
              <th  className='text-center p-2'>Quantity</th>
              <th  className='text-right p-2'>Price</th>
            </tr>
          </thead>
          <tbody>
            {currentCart?.map(  el => (
              <tr className='border' key={el._id}>
                <td className='text-left p-2'>{el.tiltle}</td>
                <td className='text-center p-2'>{el.quantity}</td>
                <td className='text-right p-2'>{formatMoney(el.price)+' VNĐ'}</td>
              </tr>
              ))}
          </tbody>
        </table>
        <span className='flex items-center gap-8 text-sm '>
          <span>Subtotal:</span>
          <span className='text-main font-bold'>{`${formatMoney(currentCart?.reduce((sum,el)=> +el?.price*el.quantity + sum,0))} VNĐ`}</span>
        </span>
        <div>
          input address
        </div>
        <div className='w-full mx-auto'>
          <Paypal amount={120} />
        </div>
      </div>
    </div>
  )
}

export default Checkout