import React, { memo } from 'react'
import { BounceLoader } from 'react-spinners'

const Loading = () => {
  return (
    <BounceLoader className='z-50' color='#ee3131'/>
  )
}

export default memo(Loading)