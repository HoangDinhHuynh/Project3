import React,{useState,useCallback} from "react";
import bg_login from '../../assets/bg-login2.jpg'
import {InputField,Button} from '../../component'
import { apiRegister,apiLogin } from "../../apis/user";
import Swal from 'sweetalert2'
import { useNavigate , useLocation } from "react-router-dom";
import path from "../../ultils/path";
import {register} from '../../store/user/userSlice'
import { useDispatch } from "react-redux";

const Login = () =>{

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    console.log(location)

    const [payLoad, setPayLoad] = useState({
        email : '',
        password: '',
        firstname : '',
        lastname : '',
        mobile: ''
    })

    const [isRegister,setIsRegister] = useState(false)
    const resetPayload = () => {
        setPayLoad({
            email : '',
            password: '',
            firstname : '',
            lastname : '',
            mobile: ''
        })
    }

    const handleSubmit = useCallback(async()=>{
        const {firstname,lastname,mobile, ...data} = payLoad 
        if(isRegister){
            const response = await apiRegister(payLoad)
            if(response.success){
                Swal.fire('Congratulation' , response.mes,'success').then(()=>{
                    setIsRegister(false)
                    resetPayload()
                })
            }else Swal.fire('Opps!' , response.mes,'error')
           
        }else{
            const rs = await apiLogin(data)
            if(rs.success){
                dispatch(register({isLoggedIn : true ,token : rs.accessToken,userData:rs.userData}))
                navigate(`/${path.HOME}`)
            }else Swal.fire('Opps!' , rs.mes,'error')
        }
    },[payLoad,isRegister])

    return(
        <div className="w-screen h-screen relative">
            <img 
            src={bg_login} 
            alt="bg-login"
            className="w-full h-full object-cover brightness-50"/>
            <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center ">
                <div className="p-8 flex flex-col items-center bg-white rounded-md min-w-[500px] shadow-xl ">
                    <h1 className="text-[28px] font-semibold text-main mb-8">{isRegister ? 'Register' : 'Login'}</h1>
                    {isRegister &&  <div className="flex items-center gap-2">
                        <InputField 
                    value={payLoad.firstname}
                    setValue={setPayLoad}
                    nameKey='firstname' />
                        <InputField 
                    value={payLoad.lastname}
                    setValue={setPayLoad}
                    nameKey='lastname'
                    />
                    </div>
                    }
                    <InputField 
                    value={payLoad.email}
                    setValue={setPayLoad}
                    nameKey='email'
                    />
                    {isRegister && <InputField 
                    value={payLoad.mobile}
                    setValue={setPayLoad}
                    nameKey='mobile'
                    />}
                    <InputField 
                    value={payLoad.password}
                    setValue={setPayLoad}
                    nameKey='password'
                    type='password'
                    />
                    <Button 
                    name={isRegister ? 'Register' : 'Login'}
                    handleOnClick={handleSubmit}
                    fw
                    />
                    <div className="flex items-center justify-between my-2 w-full text-sm">
                        {!isRegister && <span className="text-blue-500 hover:underline cursor-pointer">Forgot Your Account?</span>}
                        {!isRegister && <span 
                        className="text-blue-500 hover:underline cursor-pointer"
                        onClick={() => setIsRegister(true)}
                        >Create Account</span>}
                        {isRegister && <span 
                        className="text-blue-500 hover:underline cursor-pointer w-full text-center"
                        onClick={() => setIsRegister(false)}
                        >Go Login</span>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login