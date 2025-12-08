import React, { useState} from 'react'
import type { ChangeEvent , FormEvent } from 'react';
import { Link} from 'react-router-dom';
import axios from 'axios'
import { useAuth } from '../contexts/authData.ts';


interface SignInPayload{
    email:string
    password : string
}

interface SignInResponse{
    success : boolean;
    message : string;
    data : {
        token : string,
        user : {
            _id:string;
            name:string;
            email:string;
        }
    }
}

const handleApi = async (payload : SignInPayload) : Promise<SignInResponse> => {
    if(!payload.email || !payload.password ){
        throw new Error("both email and password is required")
    }
    
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5500/api/v1';
    const URL = `${API_BASE_URL}/auth/signin`;

    try{
        const response = await axios.post<SignInResponse>(URL , {
            email:payload.email,
            password : payload.password
        },
        {withCredentials : true}
    )

        return response.data;
    }catch(error : unknown){
        if(axios.isAxiosError(error) ){
            const errorMessage = error.response?.data?.message || `internal server error : ${error.response?.status}`
            console.error("server error data :",error.response?.data);

            throw new Error(errorMessage);
        }
        throw new Error("Network error")
     
    }

}

const SignIn = () => {

    const [email , setEmail] = useState<string>('');
    const [password , setPassword] = useState<string>('');
    const [success , setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [isLoading , setIsLoading] = useState<boolean>(false);
    const {login} = useAuth();

    const handleInputChange  = (e : ChangeEvent<HTMLInputElement>) => {
        const {name , value} = e.target;
        setError(null);
        setSuccess(null);
        if(name === 'email'){
            setEmail(value);
        }else if(name === 'password'){
            setPassword(value);
        }
    }

    const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try{
            const response = await handleApi({email , password})

            setSuccess(response.message);
            login(response.data.token , response.data.user);
        }catch(err : unknown){
            if(err instanceof Error){
                setError(err.message)
            }else{
                setError("unknown error occurred")
            }
        }finally{
            setIsLoading(false);
        }

    }

  return (
    <div className = "min-h-screen flex flex-col">
    <div className="bg-[#374151] p-6 text-[#FFFFFF] text-center">
        <h1 className="text-xl font-bold">Sign-in page</h1>
    </div>
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5 items-center justify-center ">
    
        <input 
            id = 'email'
            name = 'email'
            placeholder='email'
            //isLoading ?? returns true if isLoading is true , false if isLoading is false or null
            //this is done here because using a <boolean \ null > value is not possible here 
            disabled = {isLoading?? false}
            onChange={handleInputChange}
            className="bg-[#1F2937] rounded-sm p-2 text-[#E5E7EB]"
        />
        <input
            id = 'password'
            name = 'password'
            placeholder="password"
            type='password'
            disabled = {isLoading?? false}
            onChange = {handleInputChange}
            className="bg-[#1F2937] rounded-sm p-2 text-[#E5E7EB]"
        />
        <button
            type="submit"
            className="bg-[#2563EB] hover:bg-[#3B82F6] rounded-sm px-6 py-2 text-[#FFFFFF] flex justify-center items-center gap-2 min-w-[120px]"
            disabled={isLoading ?? false}
        >
            {isLoading ? (
                <>
                    {/* Tailwind Spinner */}
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                </>
            ) : (
                "Sign In"
            )}
        </button>

        {error && <p className = "text-red-500">{error}</p>}
        {success && <p className = "text-green-500">{success}</p>}

        <p className="text-[#E5E7EB]">
            dont have an account ? <Link to="/signup" className='underline text-[#60A5FA]'>Sign Up</Link>
        </p>
    
    </form>
    </div> 
  )
}

export default SignIn