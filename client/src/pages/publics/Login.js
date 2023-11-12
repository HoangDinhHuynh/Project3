import React,{useState,useCallback} from "react";
import bg_login from '../../assets/bg-login.jpeg'
import {InputField,Button} from '../../component'

const Login = () =>{

    const [payLoad, setPayLoad] = useState({
        email : '',
        password: '',
        name : '',
    })

    const [isRegister,setIsRegister] = useState(false)

    const handleSubmit = useCallback(()=>{
        console.log(payLoad)
    },[payLoad])

    return(
        <div className="w-screen h-screen relative">
            <img 
            src={bg_login} 
            alt="bg-login"
            className="w-full h-full object-cover"/>
            <div className="absolute top-0 bottom-0 left-0 right-1/2 flex justify-center items-center">
                <div className="p-8 flex flex-col items-center bg-white rounded-md min-w-[500px]  ">
                    <h1 className="text-[28px] font-semibold text-main mb-8">{isRegister ? 'Register' : 'Login'}</h1>
                    {isRegister &&  <InputField 
                    value={payLoad.name}
                    setValue={setPayLoad}
                    nameKey='name'
                    />}
                    <InputField 
                    value={payLoad.email}
                    setValue={setPayLoad}
                    nameKey='email'
                    />
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