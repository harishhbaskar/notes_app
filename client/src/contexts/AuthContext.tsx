import React ,{useState , useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';
import type {User , AuthContextType} from '../contexts/authData.ts'
import {AuthContext} from "../contexts/authData.ts"


export const AuthProvider: React.FC<{children : ReactNode}> = ({children}) => {
    const [user , setUser] = useState<User | null>(null);
    const [token , setToken] = useState<string | null>(null);
    const [isLoading , setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');;
        if(storedToken){
            verifyToken(storedToken);
        }else{
            setIsLoading(false);
        }
    },[]);

    const verifyToken = async (storedToken : string) => {
        try{
            const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5500/api/v1';
            const URL = `${API_BASE_URL}/auth/me`

            const response = await axios.get<{success : boolean ; data :{user:User}}>(
                `${URL}`,{headers:{Authorization : `Bearer ${storedToken}`},}
            );

            setUser(response.data.data.user);
            setToken(storedToken);
        }catch(error){
            console.error('Token verification failed:',error);
            logout();
        }finally{
            setIsLoading(false);
        }
    }

    const login = (newToken : string , newUser : User) => {
        localStorage.setItem('authToken',newToken);
        setToken(newToken);
        setUser(newUser);
        navigate('/dashboard');
    }

    const logout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
        navigate('/signin')
    }

    const value:AuthContextType = {user, token, login, logout, isLoading}
    return (
        <AuthContext.Provider value = {value} >
            {children}
        </AuthContext.Provider>
    )

}