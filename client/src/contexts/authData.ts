import React from 'react'


export interface User {
    _id: string;
    name : string;
    email : string;
}

export interface AuthContextType {
    user : User | null;
    token : string | null;
    login : (token :string , user : User)=> void;
    logout : () => void;
    isLoading : boolean;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if(!context) throw new Error("useAuth must be within authProvider");
    return context;
}
