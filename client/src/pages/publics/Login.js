import React,{useState,useCallback, useEffect} from "react";
import bg_login from '../../assets/bg-login2.jpg'
import {InputField,Button} from '../../component'
import { apiRegister,apiLogin,apiForgotPassword,apiFinalRegister } from "../../apis/user";
import Swal from 'sweetalert2'
import { useNavigate ,Link} from "react-router-dom";
import path from "../../ultils/path";
import {login} from '../../store/user/userSlice'
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { validate } from "../../ultils/helpers";

const Login = () =>{

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [payLoad, setPayLoad] = useState({
        email : '',
        password: '',
        firstname : '',
        lastname : '',
        mobile: ''
    })
    const [isVerifiedEmail, setIsVerifiedEmail] = useState(false)
    const [invalidFields, setInvalidFields] = useState([])
    const [isForgotPassword, setIsForgotPassword] = useState(false)
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
    const [token, setToken] = useState('')
    const [email, setEmail] = useState('')
    const handleForgotPassword = async() => { 
        const response = await apiForgotPassword({email})
        if(response.success){
            toast.success(response.mes ,{theme : 'colored'})

        } else toast.info(response.mes ,{theme : 'colored'})
     }
     useEffect(() => { 
        resetPayload()
      },[isRegister])
    //  SUBMIT
    const handleSubmit = useCallback(async()=>{
        const {firstname,lastname,mobile, ...data} = payLoad 

        const invalids = isRegister ? validate(payLoad,setInvalidFields) : validate(data,setInvalidFields)
        console.log(invalids)
        if (invalids === 0){
            if(isRegister){
            const response = await apiRegister(payLoad)
            if(response.success){
                setIsVerifiedEmail(true)
                
            }else Swal.fire('Opps!' , response.mes,'error')
           
        }else{
            const rs = await apiLogin(data)
            if(rs.success){
                dispatch(login({isLoggedIn : true ,token : rs.accessToken,userData:rs.userData}))
                navigate(`/${path.HOME}`)
            }else Swal.fire('Opps!' , rs.mes,'error')
        }
        }
    },[payLoad,isRegister])
    const finalRegister = async() => {
        const response = await apiFinalRegister(token)
        if(response.success){
            Swal.fire('Congratulation' , response.mes,'success').then(()=>{
                    setIsRegister(false)
                    resetPayload()
                })
        } else Swal.fire('Opps!' , response.mes,'error')
        setIsVerifiedEmail(false)
        setToken('')
    }
    return(
        <div className="w-screen h-screen relative">
            {isVerifiedEmail && <div className="absolute top-0 left-0 bottom-0 right-0 flex flex-col justify-center items-center bg-overlay z-50 animate-scale-up-center">
                <div className="bg-white w-[500px] rounded-md p-8">
                    <h4 className="">We sent a code to your mail. Please check your mail and enter your code:</h4>
                    <input 
                    type="text" 
                    value={token} 
                    onChange={e => setToken(e.target.value)}
                    className="p-2 border rounded-l-md outline-none"
                    />
                    <button
                    type="button"
                    className="px-4 py-2 bg-green-500 font-semibold text-white rounded-r-md "
                    onClick={finalRegister}
                    >
                        Sumbmit
                    </button>
                </div>
            </div>}
            {isForgotPassword && <div className="absolute animate-slide-bottom top-0 left-0 bottom-0 right-0 bg-overlay flex flex-col items-center py-8 z-50 text-white">
                <div className="flex flex-col gap-4">
                    <label htmlFor="email">Enter Your Email :</label>
                    <input 
                    type="text" 
                    id="email"
                    className="w-[800px] p-4 border-b outline-none rounded-full text-black"
                    placeholder="EX : name@gmail.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    />
                    <div className="flex items-center justify-end w-full gap-4">
                        <Button 
                        name="Submit"
                        handleOnClick={handleForgotPassword}
                        style='px-4 py-2 my-2 rounded-md text-white bg-green-500 text-semibold'
                        />
                        <Button 
                        name="Back"
                        handleOnClick={()=> setIsForgotPassword(false)}
                        />
                    </div>
                </div>
            </div>}
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
                    nameKey='firstname'
                    invalidFields={invalidFields}
                    setInvalidFields={setInvalidFields}
                    />
                        <InputField 
                    value={payLoad.lastname}
                    setValue={setPayLoad}
                    nameKey='lastname'
                    invalidFields={invalidFields}
                    setInvalidFields={setInvalidFields}
                    />
                    </div>
                    }
                    <InputField 
                    value={payLoad.email}
                    setValue={setPayLoad}
                    nameKey='email'
                    invalidFields={invalidFields}
                    setInvalidFields={setInvalidFields}
                    />
                    {isRegister && <InputField 
                    value={payLoad.mobile}
                    setValue={setPayLoad}
                    nameKey='mobile'
                    invalidFields={invalidFields}
                    setInvalidFields={setInvalidFields}
                    />}
                    <InputField 
                    value={payLoad.password}
                    setValue={setPayLoad}
                    nameKey='password'
                    type='password'
                    invalidFields={invalidFields}
                    setInvalidFields={setInvalidFields}
                    />
                    <Button 
                    name={isRegister ? 'Register' : 'Login'}
                    handleOnClick={handleSubmit}
                    fw
                    />
                    <div className="flex items-center justify-between my-2 w-full text-sm">
                        {!isRegister && <span onClick={()=> setIsForgotPassword(true)} className="text-blue-500 hover:underline cursor-pointer">Forgot Your Account?</span>}
                        {!isRegister && <span 
                        className="text-blue-500 hover:underline cursor-pointer"
                        onClick={() => setIsRegister(true)}
                        >Create Account</span>}
                        {isRegister && <span 
                        className="text-blue-500 hover:underline cursor-pointer w-full text-center"
                        onClick={() => setIsRegister(false)}
                        >Go Login</span>}
                    </div>
                    {!isRegister && <Link to={`/${path.HOME}`} className="text-blue-500 text-sm cursor-pointer">HOME</Link>}
                </div>
            </div>
        </div>
    )
}

export default Login