import React, { memo } from 'react'
import icons from '../../ultils/icon'


const { MdEmail } = icons

const Footer = () => {
  return (
    <div className='w-full '>
      <div className='h-[103px] w-full bg-main flex items-center justify-center'>
        <div className='w-main flex items-center justify-between'>
          <div className='flex flex-col flex-1'>
            <span className='text-[20px] text-gray-100'>SIGN UP TO NEWSLETTER</span>
            <small className='text-[13px] text-[#f8adad]'>Subscribe now and receive weekly newsletter</small>
          </div>
          <div className='flex-1 flex items-center'>
            <input
              type='text'
              className='p-4 pr-0 rounded-l-full w-full bg-[#f04646] text-gray-300 focus:outline-none placeholder-[#f8a3a3] placeholder-opacity-50 placeholder:font-semibold'
              placeholder='Email Address'
            />
            <div className='h-[56px] w-[56px] bg-[#f04646] rounded-r-full flex justify-center items-center text-white'>
              <MdEmail size={18} />
            </div>
          </div>
        </div>
      </div>
      <div className='h-[407px] w-full bg-gray-900 flex items-center justify-center text-white text-[13px]'>
        <div className='w-main flex '>
          <div className='flex-2 flex flex-col gap-2'>
            <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]'>ABOUT US</h3>
            <span>
              <span>Address: </span>
              <span className='opacity-70'>474 Ontario St Toronto, ON M4X 1M7 Canada</span>
            </span>
            <span>
              <span>Phone: </span>
              <span className='opacity-70'>(+1234)56789xxx</span>
            </span>
            <span>
              <span>Mail: </span>
              <span className='opacity-70'>tadathemes@gmail.com
</span>
            </span>
          </div>
          <div className='flex-1 flex flex-col gap-2'>
            <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]'>INFORMATION</h3>
            <span>Typography</span>
            <span>Gallery</span>
            <span>Store Location</span>
            <span>Today's Deals</span>
            <span>Contact</span>
          </div>
          <div className='flex-1 flex flex-col gap-2'>
            <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]'>WHO WE ARE</h3>
            <span>Help</span>
            <span>Free Shipping</span>
            <span>FAQs</span>
            <span>Return & Exchange</span>
            <span>Testimonials</span>
          </div>
          <div className='flex-1'>
          <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]'>#DIGITALWORLDSTORE</h3>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Footer)