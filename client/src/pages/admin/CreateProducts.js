import React, { useCallback, useState, useEffect } from 'react'
import { InputForm,Select,Button,MarkdownEditor } from 'component'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { validate, getBase64 } from 'ultils/helpers'
import { toast } from 'react-toastify'
import { apiCreateProduct } from 'apis'

const CreateProducts = () => {

  const {categories} = useSelector(state => state.app)
  const {register, formState:{errors}, reset, handleSubmit, watch} = useForm()
  const [payload, setPayload] = useState({
    description : ''
  })
  const [preview, setPreview] = useState({
    thumb: null,
    images : []
  })
  const [invalidFields, setInvalidFields] = useState([])
  const changeValue = useCallback((e) => { 
      setPayload(e)
   },[payload])
  const [hoverElm, setHoverElm] = useState(null)
  const hanldePreviewThumb = async(file) =>  {
      const base64Thumb = await getBase64(file)
      setPreview(prev => ({...prev, thumb : base64Thumb}))
  }
  const hanldePreviewImanges = async (files) => { 
      const imagesPreview = []
      for (let file of files){
          if(file.type !== 'image/png' && file.type !== 'image/jpeg'){
              toast.warning('File not supported !')
              return
          }
          const base64 = await getBase64(file)
          imagesPreview.push({name : file.name, path : base64})
        }
        setPreview(prev => ({...prev, images : imagesPreview}))
   }
  useEffect(() => { 
    hanldePreviewThumb(watch('thumb')[0])
   },[watch('thumb')])
   useEffect(() => { 
    hanldePreviewImanges(watch('images'))
   },[watch('images')])

  const hanldeCreateProduct =  async(data) => {
    const invalids = validate(payload,setInvalidFields)
    if(invalids === 0) {
      if(data.category) data.category = categories?.find(el => el._id === data.category)?.tiltle
      const finalPayload = {...data, ...payload}
      const formData = new FormData()
      for(let i  of  Object.entries(finalPayload)) formData.append(i[0] ,i[1] )
      if (finalPayload.thumb) formData.append('thumb', finalPayload.thumb[0])
      if (finalPayload.images) {
        for (let image of finalPayload.images) formData.append('images', image)
      }
      const respone = await apiCreateProduct (formData)

    }
  }
  // const handleRemoveImage = (name) => { 
  //   const files = [...watch('images')]
  //     reset({
  //       images : files?.filter(el => el.name !== name)
  //     })
  //     if(preview.images?.some(el => el.name === name)) setPreview(prev => ({...prev, images : prev.images?.filter(el => el.name !== name)}))
  //  }
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
            {preview.thumb && <div className='my-4'>
              <img src={preview.thumb} alt='thumbnail' className='w-[200px] object-contain'/>
            </div>}
            <div className='flex flex-col gap-2 my-8'>
              <label htmlFor='products' className='font-semibold'>Upload images of product</label>
              <input 
                type='file'
                id='products'
                multiple 
                {...register('images',{required:'Need Atleast One Image'})}
              />
               {errors['images'] && <small className='text-xs text-red-500'>{errors['images']?.message}</small>}
            </div>
            {preview.images.length > 0 && <div className='my-4 flex w-full gap-3 flex-wrap'>
              {preview.images?.map((el,idx) => (
                <div 
                  onMouseEnter={() => setHoverElm(el.name)} 
                  key={idx} 
                  className='w-fit relative'
                  onMouseLeave={() => setHoverElm(null)} 
                >
                      <img  src={el.path} alt='product' className='w-[200px] object-contain'/>
                      {/* {hoverElm === el.name && <div 
                        className='absolute animate-scale-up-center-fast cursor-pointer inset-0 bg-overlay flex items-center justify-center'
                        onClick={() => handleRemoveImage(el.name)}
                      >
                        <IoTrashBinSharp size={24} color='white'/></div>} */}
                </div>
              ))}
            </div>}
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