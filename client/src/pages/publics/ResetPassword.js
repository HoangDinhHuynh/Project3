import React,{useState} from 'react'
import { Button } from '../../component'
import { useParams } from 'react-router-dom'
import { apiResetPassword } from '../../apis/user'
import { toast } from 'react-toastify'

const ResetPassword = () => {
    const [password, setPassword] = useState('')
    const {token} = useParams()
    const handleResetPassword = async() => { 
        const response = await apiResetPassword({password,token})
        if(response.success){
            toast.success(response.mes ,{theme : 'colored'})

        } else toast.error(response.mes ,{theme : 'colored'})
     }
  return (
    // <div className="absolute animate-slide-bottom top-0 left-0 bottom-0 right-0 bg-overlay flex flex-col items-center py-8 z-50 text-white">
                <div className="flex flex-col gap-4 py-10">
                    <label htmlFor="password">Enter Your New Password :</label>
                    <input 
                    type="text" 
                    id="password"
                    className="w-[800px] p-4 border-b outline-none rounded-full text-black"
                    placeholder="Type here"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    />
                    <div className="flex items-center justify-end w-full gap-4">
                        <Button 
                        name="Submit"
                        handleOnClick={handleResetPassword}
                        style='px-4 py-2 my-2 rounded-md text-white bg-green-500 text-semibold'
                        />
                    </div>
                </div>
            /* </div> */
  )
}

export default ResetPassword