import React from 'react'
import { useParams } from 'react-router-dom'

const DetailProduct = () => {

  const {pid ,tiltle} = useParams()
  // console.log(pid , tiltle) 

  return (
    <div>DetailProduct</div>
  )
}

export default DetailProduct