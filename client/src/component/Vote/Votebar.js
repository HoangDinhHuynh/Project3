import React, {useRef,useEffect, memo} from 'react'
import {AiFillStar} from 'react-icons/ai'

const Votebar = ({number , ratingCount, ratingTotal}) => {

    const percentRef = useRef()
    useEffect(() => { 
        const percent = Math.round(ratingCount*100/ratingTotal) || 0
        percentRef.current.style.cssText = `right: ${100 - percent }%`
     },[ratingCount,ratingTotal])

  return (
    <div className='flex items-center gap-4 tetx-sm text-gray-500'>
        <div className=' flex w-[10%] items-center justify-center gap-1 text-sm'>
            <span>{number}</span>
            <AiFillStar color='orange'/>
        </div>
        <div className='w-[75%]'>
            <div className='relative w-full h-[6px] bg-gray-200 rounded-full'>
                <div ref={percentRef} className='absolute inset-0 bg-red-500 rounded-full '></div>
            </div>
        </div>
        <div className='w-[15%] flex justify-center text-xs text-400'>{`${ratingCount || 0} reviewers`}</div>
    </div>
  )
}

export default memo(Votebar)