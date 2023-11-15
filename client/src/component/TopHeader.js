import React, { memo ,useEffect} from 'react'
import { Link } from 'react-router-dom'
import path from '../ultils/path'
import { getCurrent } from '../store/user/asyncAction'
import { useDispatch,useSelector } from 'react-redux'
import icons from '../ultils/icon'
import { logout } from '../store/user/userSlice'


const {AiOutlineLogout} = icons
const TopHeader = () => {
    const dispatch = useDispatch()
    const {isLoggedIn ,current} = useSelector(state => state.user)

    useEffect(() => { 
      const setTimeOutId = setTimeout(() => { 
        if (isLoggedIn) dispatch(getCurrent())
       },300)
      return () => {
        clearTimeout(setTimeOutId)
      }
     },[dispatch,isLoggedIn])
  return (
    <div className='h-[38px] w-full bg-main flex items-center justify-center'>
        <div className='w-main flex items-center justify-between text-xs text-white'>
                <span>ORDER ONLINE OR CALL US (+1800) 000 8808</span>
                {isLoggedIn 
                ? <div className='flex gap-4 text-sm items-center'>
                    <span>{`Welcome, ${current?.firstname} ${current?.lastname}`}</span>
                    <span
                    onClick={() => dispatch(logout())}
                    className='hover:cursor-pointer hover:rounded-full hover:bg-gray-200 hover:text-main p-2'><AiOutlineLogout size={18}/></span>
                </div> 
                :<Link to={`${path.LOGIN}`} className='hover:text-black delay-75'>Sign In or Create Account</Link> }
        </div>
    </div>
  )
}

export default memo(TopHeader)