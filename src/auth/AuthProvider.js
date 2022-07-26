import { createContext, useState, useEffect } from "react";
import { getUser } from "../utils/common";

export const AuthContext = createContext({});

const AuthProvider=({children})=>{
    const [auth, setAuth] = useState(
      getUser() || null
    );

    useEffect(() =>{
      localStorage.setItem("userData", JSON.stringify(auth))
    },[auth])

    return (
      <AuthContext.Provider value={{ auth, setAuth }}>
        {children}
      </AuthContext.Provider>
    );
  };
export default AuthProvider