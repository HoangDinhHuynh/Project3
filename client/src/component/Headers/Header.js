import React ,{Fragment,memo, useState} from "react";
import logo from 'assets/logo.png'
import icons from 'ultils/icon'
import {Link} from 'react-router-dom'
import path from 'ultils/path'
import { useDispatch, useSelector } from 'react-redux'
import withBase from "hocs/withBase";
import { showCart } from "store/app/appSlice";

const {RiPhoneFill, MdEmail ,BsFillHandbagFill,FaUserCircle} = icons
const Header = ({dispatch}) => {

    const { current } = useSelector(state => state.user)
    const [isShowOption, setIsShowOption] = useState(false)
    return (
        <div className="w-main flex justify-between h-[110px] py-[35px]">
            <Link to={`/${path.HOME}`}>
            <img src={logo} alt="logo" className="w-[234px] object-contain" />
            </Link>
            <div className="flex text-[13px]">
                <div className="flex flex-col px-6 border-r items-center">
                    <span className="flex gap-4 items-center">
                        <RiPhoneFill color="red" />
                        <span className="font-semibold"> (+1800) 000 8808</span>
                    </span>
                    <span>Mon-Sat 9:00AM - 8:00PM</span>
                </div>
                <div className="flex flex-col px-6 border-r items-center">
                    <span className="flex gap-4 items-center">
                        <MdEmail color="red" />
                        <span className="font-semibold">SUPPORT@TADATHEMES.COM</span>
                    </span>
                    <span>Online Support 24/7</span>
                </div>
                {current && <Fragment>
                    <div onClick={()=>dispatch(showCart())} className="cursor-pointer flex items-center px-6 border-r justify-center gap-2">
                    <BsFillHandbagFill color="red"/>
                    <span>{`${current?.cart?.length || 0} item(s)`}</span>
                </div>
                <div 
                    className="cursor-pointer flex items-center px-6  justify-center gap-2 relative"
                    onClick={()=> setIsShowOption(prev => !prev)}
                >
                    <FaUserCircle color="red"/>
                    <span>Profile</span>
                    {isShowOption && <div className="flex flex-col absolute top-full left-[16px] bg-gray-100 border min-w-[150px] py-2">
                        <Link 
                            className="p-2 w-full hover:bg-sky-100" 
                            to={`/${path.MEMBER}/${path.PERSONAL}`}>
                                Personal
                        </Link>
                        {+current?.role == 2000 && <Link 
                            className="p-2 w-full hover:bg-sky-100" 
                            to={`/${path.ADMIN}/${path.DASHBOARD}`}>
                                Admin workspace
                        </Link>}
                        {/* <span 
                            onClick={() => dispatch(logout())}
                            className="p-2 w-full hover:bg-sky-100">
                                Logout
                        </span> */}
                    </div>}
                </div>
                
                
                </Fragment>}
            </div>
        </div>
    )
}

export default withBase(memo(Header))