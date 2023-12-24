import withBase from 'hocs/withBase';
import React, { memo } from 'react'
import { IoIosCloseCircle } from "react-icons/io";
import { useSelector } from 'react-redux';
import { showCart } from 'store/app/appSlice';

const Cart = ({dispatch}) => {

    const {current} = useSelector(state => state.user)
    console.log(current)

  return (
    <div onClick={e => e.stopPropagation()} className='w-[400px] h-screen  bg-black grid grid-rows-10 text-white p-6'>
        <header className='border-b border-gray-500 flex justify-between items-center row-span-1 h-full font-bold text-2xl'>
            <span>Your Cart</span>
            <span onClick={()=> dispatch(showCart())} className='cursor-pointer p-2'><IoIosCloseCircle size={24} /></span>
        </header>
        <section className='row-span-6 gap-3 flex flex-col h-full  max-h-full overflow-y-auto py-3'>
            {!current?.cart && <span className='text-xs italic'>Your cart is empty.</span>}
            {current?.cart && current?.cart?.map(el => (
                <div key={el._id} className='flex gap-2'>
                    <img src={el.product?.thumb} alt='thumb' className='w-16 h-16 object-cover rounded-md'/>
                    <div className='flex flex-col gap-1'>
                        <span className='font-bold text-main'>{el.product?.tiltle}</span>
                        <span className='text-xs'>{el.color}</span>
                        <span className='text-base'>{el.product?.price}</span>
                    </div>
                </div>
            ))}
        </section>
        <div className='row-span-3 h-full'>
            checkout
        </div>
    </div>
  )
}

export default withBase(memo(Cart))