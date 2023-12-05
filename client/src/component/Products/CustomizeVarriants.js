import { apiAddVarriant } from 'apis'
import { Button, Loading, InputForm } from 'component'
import React, { memo, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { showModal } from 'store/app/appSlice'
import Swal from 'sweetalert2'
import { getBase64 } from 'ultils/helpers'

const CustomizeVarriants = ({ customizeVarriant, setCustomizeVarriant, render }) => {

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm()

  const [preview, setPreview] = useState({
    thumb: '',
    images: '',
  })
  const dispatch = useDispatch()
  useEffect(() => {
    reset({
      tiltle: customizeVarriant?.tiltle,
      color: customizeVarriant?.color,
      price: customizeVarriant?.price,

    })
  }, [customizeVarriant])
  const handleAddVarriant = async (data) => {
    if (data.color === customizeVarriant.color) Swal.fire('Oops!', 'Varriant cant have the same color', 'info')
    else {
      const formData = new FormData()
      for (let i of Object.entries(data)) formData.append(i[0], i[1])
      if (data.thumb) formData.append('thumb', data.thumb[0])
      if (data.images) {
        for (let image of data.images) formData.append('images', image)
      }
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
      const respone = await apiAddVarriant(formData, customizeVarriant._id)
      dispatch(showModal({ isShowModal: false, modalChildren: null }))
    }
  }
  const hanldePreviewThumb = async (file) => {
    const base64Thumb = await getBase64(file)
    setPreview(prev => ({ ...prev, thumb: base64Thumb }))
  }
  const hanldePreviewImanges = async (files) => {
    const imagesPreview = []
    for (let file of files) {
      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        toast.warning('File not supported !')
        return
      }
      const base64 = await getBase64(file)
      imagesPreview.push(base64)
    }
    setPreview(prev => ({ ...prev, images: imagesPreview }))
  }
  useEffect(() => {
    if (watch('thumb') instanceof FileList && watch('thumb').length > 0)
      hanldePreviewThumb(watch('thumb')[0])
  }, [watch('thumb')])
  useEffect(() => {
    if (watch('images') instanceof FileList && watch('images').length > 0)
      hanldePreviewImanges(watch('images'))
  }, [watch('images')])

  return (
    <div className='w-full flex flex-col gap-4 relative'>
      <div className='h-[69px] w-full'></div>
      <div className='p-4  border-b bg-gray-100 flex justify-between items-center fixed top-0 right-0 left-[327px]'>
        <h1 className='text-3xl font-bold tracking-tight '>Customize varriants of products</h1>
        <span className='text-main hover:underline cursor-pointer' onClick={() => setCustomizeVarriant(null)}>Cancel</span>
      </div>
      <form onSubmit={handleSubmit(handleAddVarriant)} className='p-4 w-full flex flex-col gap-4'>
        <div className='flex gap-4 items-center w-full'>
          <InputForm
            label='Original Name'
            register={register}
            errors={errors}
            id='tiltle'
            fullWidth
            style='flex-auto'
            validate={{
              required: 'Need fill this field'
            }}
            placeholder='Tiltle of varriant'
          />
        </div>
        <div className='flex gap-4 items-center w-full'>
          <InputForm
            label='Price varriant'
            register={register}
            errors={errors}
            id='price'
            validate={{
              required: 'Need fill this field'
            }}
            fullWidth
            placeholder='Price of varriant'
            type='number'
            style='flex-auto'
          />
          <InputForm
            label='Color varriant'
            register={register}
            errors={errors}
            id='color'
            validate={{
              required: 'Need fill this field'
            }}
            fullWidth
            placeholder='Color of varriant'
            style='flex-auto'
          />
        </div>
        <div className='flex flex-col gap-2 mt-8'>
          <label htmlFor='thumb' className='font-semibold'>Upload thumb</label>
          <input
            type='file'
            id='thumb'
            {...register('thumb', { required: 'Need One Image' })}
          />
          {errors['thumb'] && <small className='text-xs text-red-500'>{errors['thumb']?.message}</small>}
        </div>
        {preview.thumb && <div className='my-4'>
          <img src={preview.thumb} alt='thumbnail' className='w-[200px] object-contain' />
        </div>}
        <div className='flex flex-col gap-2 my-8'>
          <label htmlFor='products' className='font-semibold'>Upload images of product</label>
          <input
            type='file'
            id='products'
            multiple
            {...register('images', { required: 'Need Atleast One Image' })}
          />
          {errors['images'] && <small className='text-xs text-red-500'>{errors['images']?.message}</small>}
        </div>
        {preview.images.length > 0 && <div className='my-4 flex w-full gap-3 flex-wrap'>
          {preview.images?.map((el, idx) => (
            <div
              key={idx}
              className='w-fit relative'
            >
              <img src={el} alt='product' className='w-[200px] object-contain' />
              {/* {hoverElm === el.name && <div 
                        className='absolute animate-scale-up-center-fast cursor-pointer inset-0 bg-overlay flex items-center justify-center'
                        onClick={() => handleRemoveImage(el.name)}
                      >
                        <IoTrashBinSharp size={24} color='white'/></div>} */}
            </div>
          ))}
        </div>}
        <div className='my-8'>
          <Button type='submit'>Add varriants</Button>
        </div>
      </form>
    </div>
  )
}

export default memo(CustomizeVarriants)