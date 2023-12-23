import React,{ memo, useState, useEffect, useCallback } from 'react'
import { Button, InputForm, MarkdownEditor, Select, Loading } from 'component'
import { useForm } from 'react-hook-form'
import { useSelector,useDispatch } from 'react-redux'
import { validate, getBase64 } from 'ultils/helpers'
import { toast } from 'react-toastify'
import { apiUpdateProduct } from 'apis/product'
import { showModal } from 'store/app/appSlice'

const UpdateProduct = ({editProduct, render, setEditProduct}) => {
  
    const {register, handleSubmit, formState:{errors}, reset, watch} = useForm()
    const {categories} = useSelector(state => state.app)
    const dispatch = useDispatch()

    const [payload, setPayload] = useState({
        description : ''
      })
    const [preview, setPreview] = useState({
        thumb: null,
        images : []
    })
    useEffect(() => { 
        reset({
            tiltle: editProduct?.tiltle || '',
            price: editProduct?.price || '',
            quantity: editProduct?.quantity || '',
            color: editProduct?.color || '',
            category: editProduct?.category || '',
            brand: editProduct?.brand?.toLowerCase() || '',
        })
        setPayload({description : typeof editProduct?.description === 'object' ? editProduct?.description?.join(', '): editProduct?.description})
        setPreview({
            thumb : editProduct?.thumb || '',
            images : editProduct?.images || []
          })
    },[editProduct])
    const [invalidFields, setInvalidFields] = useState([])
    const changeValue = useCallback((e) => { 
      setPayload(e)
    },[payload])
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
            imagesPreview.push(base64)
          }
          setPreview(prev => ({...prev, images : imagesPreview}))
     }
  
    useEffect(() => { 
        if(watch ('thumb') instanceof FileList && watch('thumb').length > 0)
        hanldePreviewThumb(watch('thumb')[0])
    },[watch('thumb')])
    useEffect(() => { 
        if (watch ('images') instanceof FileList && watch('images').length > 0)
        hanldePreviewImanges(watch('images'))
    },[watch('images')])
    
    const hanldeUpdateProduct =  async(data) => {
        const invalids = validate(payload,setInvalidFields)
        if(invalids === 0) {
          if(data.category) data.category = categories?.find(el => el.tiltle === data.category)?.tiltle
          const finalPayload = {...data, ...payload,}
          const formData = new FormData()
          finalPayload.thumb = data?.thumb?.length === 0 ? preview?.thumb : data?.thumb[0]
          for (let i of Object.entries (finalPayload)) formData.append(i[0], i[1])
          finalPayload.images = data.images?.length === 0 ? preview?.images : data?.images
          for (let image of finalPayload.images) formData.append('images', image)
          dispatch(showModal({isShowModal : true , modalChildren : <Loading />}))
          const respone = await apiUpdateProduct(formData, editProduct._id)
          dispatch(showModal({isShowModal : false , modalChildren : null}))
          if(respone.success) {
            toast.success(respone.mes)
            render()
            setEditProduct(null)
          }else toast.error(respone.mes)
        }
      }

  return (

    <div className='w-full flex flex-col gap-4 relative'>
        <div className='h-[69px] w-full'></div>
        <div className='p-4  border-b bg-gray-100 flex justify-between items-center fixed top-0 right-0 left-[327px]'>
            <h1 className='text-3xl font-bold tracking-tight '>Update products</h1>
            <span className='text-main hover:underline cursor-pointer' onClick={() => setEditProduct(null)}>Cancel</span>
        </div>
        <div className='p-4'>
        <form onSubmit={handleSubmit(hanldeUpdateProduct)}>
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
                options={categories?.map(el => ({code: el.tiltle ,value : el.tiltle}))}
                register={register}
                id='category'
                validate={{required : 'Need fill this field'}}
                style='flex-auto'
                errors={errors}
                fullWidth
              />
              <Select 
                label='Brand (Optional)'
                options={categories?.find(el => el.tiltle === watch('category'))?.brand?.map(el => ({code : el.toLowerCase(), value: el}))}
                register={register}
                id='brand'
                style='flex-auto'
                errors={errors}
                fullWidth
              />
            </div>
            <div className='flex flex-col gap-2 mt-8 '>
              <label htmlFor='thumb' className='font-semibold'>Upload thumb</label>
              <input 
                type='file' 
                id='thumb'
                {...register('thumb')}
              />
              {errors['thumb'] && <small className='text-xs text-red-500'>{errors['thumb']?.message}</small>}
            </div>
            {preview.thumb && <div className='my-4 '>
              <img src={preview.thumb} alt='thumbnail' className='w-[200px] object-contain'/>
            </div>}
            <div className='flex flex-col gap-2 my-8 '>
              <label htmlFor='products' className='font-semibold'>Upload images of product</label>
              <input 
                type='file'
                id='products'
                multiple 
                {...register('images')}
              />
               {errors['images'] && <small className='text-xs text-red-500'>{errors['images']?.message}</small>}
            </div>
            {preview.images.length > 0 && <div className='my-4 flex w-full gap-3 flex-wrap'>
              {preview.images?.map((el,idx) => (
                <div 
                  key={idx} 
                  className='w-fit relative'
                >
                      <img  src={el} alt='product' className='w-[200px] object-contain'/>
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
              value={payload.description}
            />
            <div className='my-8 '>
              <Button  type='submit'>Update Product</Button>
            </div>
        </form>
      </div>
    </div>
  )
}

export default memo(UpdateProduct)