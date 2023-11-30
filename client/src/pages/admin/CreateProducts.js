import React, { useCallback, useState } from 'react'
import { InputForm,Select,Button,MarkdownEditor } from 'component'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { validate } from 'ultils/helpers'

const CreateProducts = () => {

  const {categories} = useSelector(state => state.app)
  const {register, formState:{errors}, reset, handleSubmit, watch} = useForm()
  const [payload, setPayload] = useState({
    description : ''
  })

  const [invalidFields, setInvalidFields] = useState([])
  const changeValue = useCallback((e) => { 
      setPayload(e)
   },[payload])

  const hanldeCreateProduct = (data) => {
    const invalids = validate(payload,setInvalidFields)
    if(invalids === 0) {
      if(data.category) data.category = categories?.find(el => el._id === data.category)?.tiltle
      const finalPayload = {...data, ...payload}
      const formData = new FormData()
      for(let i  of  Object.entries(finalPayload)) formData.append(i[0] ,i[1] )

    }
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
            <div className='flex flex-col gap-2 mt-8'>
              <label htmlFor='thumb' className='font-semibold'>Upload thumb</label>
              <input 
                type='file' 
                id='thumb'
                {...register('thumb',{required:'Need One Image'})}
              />
              {errors['thumb'] && <small className='text-xs text-red-500'>{errors['thumb']?.message}</small>}
            </div>
            <div className='flex flex-col gap-2 my-8'>
              <label htmlFor='products' className='font-semibold'>Upload images of product</label>
              <input 
                type='file'
                id='products'
                multiple 
                {...register('products',{required:'Need Atleast One Image'})}
              />
               {errors['products'] && <small className='text-xs text-red-500'>{errors['products']?.message}</small>}
            </div>
            <MarkdownEditor 
              name='description'
              changeValue={changeValue}
              label='Desciption'
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />
            <div className='my-8'>
              <Button  type='submit'>Create New Product</Button>
            </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProducts