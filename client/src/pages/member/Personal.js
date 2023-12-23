import { Button, InputForm } from 'component'
import moment from 'moment'
import React from 'react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'

const Personal = () => {

  const {register, formState: {errors} , handleSubmit , reset} = useForm()
  const { current} = useSelector(state => state.user)
  useEffect(() => {
    reset({
      firstname : current?.firstname,
      lastname : current?.lastname,
      mobile : current?.mobile,
      email : current?.email,
      avatar : current?.avatar,
    })
  },[current])
  const handleUpdateInformation = (data) => {
    console.log(data)
  }
  return (
    <div className='w-full relative px-4'>
      <header className='text-3xl font-semibold py-4 border-b border-b-blue-200'>
          Personal
      </header>
      <form onSubmit={handleSubmit(handleUpdateInformation)} className='w-4/5 mx-auto py-8 flex flex-col'>
        <InputForm 
              label='Firstname'
              register={register}
              errors={errors}
              id='firstname'
              validate={{
                required : 'Need fill this field'
              }}
              fullWidth
        />
        <InputForm 
              label='Lastname'
              register={register}
              errors={errors}
              id='lastname'
              validate={{
                required : 'Need fill this field'
              }}
              fullWidth
        />
        <InputForm 
              label='Email address'
              register={register}
              errors={errors}
              id='email'
              validate={{
                required : 'Need fill this field'
              }}
              fullWidth
        />
         <InputForm 
              label='Phone'
              register={register}
              errors={errors}
              id='mobile'
              validate={{
                required : 'Need fill this field'
              }}
              fullWidth
        />
        <div className='flex items-center gap-2'>
          <span className='font-medium'>Account Status:</span>
          <span>{current?.isBlocked ? "Blocked" : "Actived"}</span>
        </div>
        <div className='flex items-center gap-2'>
          <span className='font-medium'>Account Status:</span>
          <span>{+current?.role === 2000 ? "Admin" : "User"}</span>
        </div>
        <div className='flex items-center gap-2'>
          <span className='font-medium'>Created At:</span>
          <span>{moment(current?.createdAt).fromNow()}</span>
        </div>
        <div className='w-full flex justify-end'><Button type="submit">Update Information</Button></div>
      </form>
    </div>
  )
}

export default Personal