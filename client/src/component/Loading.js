import React, { memo } from 'react'
import { CircleLoader } from 'react-spinners'

const Loading = () => {
  return (
    <CircleLoader className='z-10' color='#ee3131'/>
  )
}

export default memo(Loading)