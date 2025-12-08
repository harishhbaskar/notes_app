import React ,{useState}from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import type {ChangeEvent , FormEvent} from 'react';
import {useAuth} from "../contexts/authData.ts"


interface SignUpPayload{
    name:string
    email:string
    password : string
}

interface SignUpResponse{
    success : boolean;
    message : string;
    data : {
        token : string,
        user : {
            _id : string;
            email : string;
            name : string;
        }
    }
}

const handleApi = async (payload : SignUpPayload) : Promise<SignUpResponse> => {
    const requiredFields:(keyof SignUpPayload)[] = ["name","email","password"]

    for(const field of requiredFields){
        if(!payload[field]){
            throw new Error(`${field} is required`)
        }
    }

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5500/api/v1';
    const URL = `${API_BASE_URL}/auth/signup`

    try{
        const response = await axios.post<SignUpResponse>(URL , {
            name:payload.name,
            email:payload.email,
            password:payload.password
        },
        {withCredentials:true}
    )
        return response.data;
    }catch(error:unknown){
        if(axios.isAxiosError(error)){
            const errorMessage = error.response?.data?.message || `internal server error : ${error.response?.status}`
            console.error("Server Error :",error.response?.data )

            throw new Error(errorMessage);
        }
        throw new Error("Network error")
    }
}


const SignUp = () => {
    const[name, setName] = useState<string>('');
    const[email , setEmail] = useState<string>('');
    const[password , setPassword] = useState<string>('');
    const[success , setSuccess] = useState<string | null>(null);
    const[error,setError] = useState<string | null>(null);
    const[isLoading , setIsLoading] = useState<boolean>(false);
    const{login} = useAuth();

    const handleInputChange = (e : ChangeEvent<HTMLInputElement>) => {
        const {name , value} = e.target;
        setError(null);
        setSuccess(null);
        if(name === "name"){
            setName(value);
        }
        if(name === "email"){
            setEmail(value);
        }
        if(name === "password"){
            setPassword(value);
        }
    }

    const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try{
            const response = await handleApi({name , email , password})
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
    <div className = "bg-[#374151] p-6 text-[#FFFFFF] text-center">
        <h1 className ="text-xl font-bold">Sign-up page</h1>
    </div>
    <form onSubmit={handleSubmit} className ="flex-1 flex  flex-col gap-5 items-center justify-center" >
        <input 
            id="name"
            name="name"
            placeholder='username'
            disabled ={isLoading?? false}
            onChange={handleInputChange}
            className="bg-[#1F2937] rounded-sm p-2 text-[#E5E7EB]"
        />
        <input 
            id="email"
            name="email"
            placeholder='email'
            disabled={isLoading ?? false}
            onChange={handleInputChange}
            className="bg-[#1F2937] rounded-sm p-2 text-[#E5E7EB]"
        />
        <input
            id="password"
            name="password"
            placeholder="password"
            disabled = {isLoading ?? false}
            onChange = {handleInputChange}
            className="bg-[#1F2937] rounded-sm p-2 text-[#E5E7EB]"
        />
        <button
            type="submit"
            disabled={isLoading ?? false}
            className="bg-[#2563EB] hover:bg-[#3B82F6] rounded-sm px-6 py-2 text-[#FFFFFF] "            
        >sign up</button>

        {error && <p className = "text-red-500">{error}</p>}
        {success && <p className = "text-green-500">{success}</p>}
        <p className="text-[#E5E7EB]">
            Already have an account ? <Link to="/signin" className='underline text-[#60A5FA]'>Sing In</Link>
        </p>
    </form>
    </div>
  )
}

export default SignUp