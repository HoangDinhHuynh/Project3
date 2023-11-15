import React, { memo, useState,useCallback } from 'react'
import {productInfoTabs} from '../ultils/contants'
import {Votebar ,Button, VoteOption ,Comment} from './'
import { renderStarFromNumber} from '../ultils/helpers'
import { apiRatings } from '../apis' 
import { useDispatch,useSelector } from 'react-redux'
import {showModal} from '../store/app/appSlice'
import Swal from 'sweetalert2'
import path from '../ultils/path'
import { useNavigate } from 'react-router-dom'



const ProductInfomation = ({totalRating ,ratings,nameProduct,pid,reRender}) => {
  
    const [activedTab, setActivedTab] = useState(1)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {isLoggedIn} = useSelector(state => state.user)

     const hanldeSubmitVoteOption = async({comment,score}) => { 
      console.log(comment,score,pid)
      if(!comment || !pid || !score) {
          alert('Please vote went click submit')
          return
      }
      await apiRatings({pid,star:score ,comment,updatedAt:Date.now()})
      dispatch(showModal({isShowModal:false,modelChildren:null}))
      reRender()
      }
    const handleVoteNow = () => { 
      if(!isLoggedIn) {
        Swal.fire({
          text:'Login to vote',
          cancelButtonText: 'Cancel',
          confirmButtonText: 'Go Login',
          title:'Oops',
          showCancelButton: true,
        }).then((rs)=>{
          if(rs.isConfirmed) navigate(`/${path.LOGIN}`)
        })
      } else {
        dispatch(showModal({isShowModal:true, modalChildren : <VoteOption
          nameProduct={nameProduct}
          hanldeSubmitVoteOption={hanldeSubmitVoteOption}/>}))
      }
     }  
  return (
    <div className=''>
        <div className='flex items-center gap-2 relative bottom-[-1px]'>
        {productInfoTabs.map(el=>(
            <span 
            onClick={()=>setActivedTab(el.id)}
            key={el.id} 
            className={`py-2 px-4 cursor-pointer ${activedTab === el.id ? 'bg-white border border-b-0':'bg-gray-200'}`}
            >{el.name}</span>
            
        ))}
       
        </div>
        <div className='w-full border p-4'>
            {productInfoTabs.some(el => el.id === activedTab) && productInfoTabs.find(el => el.id === activedTab)?.content}
            
        </div>
        <div className='flex flex-col py-8 w-main'>
                  <div className='flex border'>
                  <div className='flex-4 flex flex-col items-center justify-center   gap-2'>
                    <span className='font-semibold text-3xl'>{`${totalRating}/5`}</span>
                    <span className='flex items-center gap-1'>{renderStarFromNumber(totalRating)?.map((el,index) => (
                      <span key={index}>{el}</span>
                    ))}</span>
                    <span className='text-sm'>{`${ratings?.length} reviewers and commentor`}</span>
                  </div>
                  <div className='flex-6 gap-2  flex flex-col p-4'>
                    {Array.from(Array(5).keys()).reverse().map(el =>(
                      <Votebar
                        key={el}
                        number={el+1}
                        ratingTotal={ratings?.length}
                        ratingCount={ratings?.filter(i=> i.star === el + 1)?.length}
                      />
                    ))}
                  </div>
                  </div>
                  <div className='p-4 flex items-center justify-center tetx-sm flex-col gap-2'>
                <span>Do you review this product?</span>
                <Button handleOnClick={handleVoteNow}>
                    Vote Now !
                  </Button>
              </div>
              <div className='flex flex-col gap-4'>
                 {ratings?.map(el => (
                    <Comment 
                    key={el._id}
                    star={el.star}
                    updatedAt={el.updatedAt}
                    comment={el.comment}
                    name={`${el.postedBy?.lastname} ${el.postedBy?.firstname} `}
                    />
                 ))}
              </div>
              </div>
    </div>
  )
}

export default memo(ProductInfomation)