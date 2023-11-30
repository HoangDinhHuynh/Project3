import React from 'react'
import { InputForm,Select,Button } from 'component'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'

const CreateProducts = () => {

  const {categories} = useSelector(state => state.app)
  const {register, formState:{errors}, reset, handleSubmit, watch} = useForm()
  const hanldeCreateProduct = (data) => {
    if(data.category) data.category = categories?.find(el => el._id === data.category)?.tiltle
    console.log(data)
  }


  return (
    <div className='w-full'>
      <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
        <span>Create New Product</span>
      </h1>
      <div className='p-4'>
        <form onSubmit={handleSubmit(hanldeCreateProduct)}>
            <InputForm 
              label='Name product'
              register={register}
              errors={errors}
              id='tiltle'
              validate={{
                required : 'Need fill this field'
              }}
              fullWidth
              placeholder='Name of new Product'
            />
            <div className='w-full my-6 flex gap-4'>
            <InputForm 
              label='Price'
              register={register}
              errors={errors}
              id='price'
              validate={{
                required : 'Need fill this field'
              }}
              style='flex-auto'
              placeholder='Price of new Product'
              type='number'
              fullWidth
            />
            <InputForm 
              label='Quantity'
              register={register}
              errors={errors}
              id='quantity'
              validate={{
                required : 'Need fill this field'
              }}
              style='flex-auto'
              placeholder='Quantity of new Product'
              type='number'
              fullWidth
            />
              <InputForm 
                label='Color'
                register={register}
                errors={errors}
                id='color'
                validate={{
                  required : 'Need fill this field'
                }}
                style='flex-auto'
                placeholder='Color of new Product'
                fullWidth
            />
            </div>
            <div className='w-full my-6 flex gap-4'>
              <Select 
                label='Category'
                options={categories?.map(el => ({code: el._id ,value : el.tiltle}))}
                register={register}
                id='category'
                validate={{required : 'Need fill this field'}}
                style='flex-auto'
                errors={errors}
                fullWidth
              />
              <Select 
                label='Brand (Optional)'
                options={categories?.find(el => el._id === watch('category'))?.brand?.map(el => ({code : el, value: el}))}
                register={register}
                id='brand'
                style='flex-auto'
                errors={errors}
                fullWidth
              />
            </div>
            <Button type='submit'>Create New Product</Button>
        </form>
      </div>
    </div>
  )
}

export default CreateProducts