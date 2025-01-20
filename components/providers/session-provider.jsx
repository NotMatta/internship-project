"use client"
import { createContext, useState, useEffect, useContext } from "react";
import { useToast } from "@/hooks/use-toast";
import { validatePassword, validateUsername } from "@/lib/utils";

const SessionContext = createContext();


const SessionProvider = ({ children }) => {
  const [session, setSession] = useState({user:null,token:null,status:"loading"});
  const {toast} = useToast()
  

  useEffect(() => {

    const verifySession = async (token) => {
      if(!token) return false
      const res = await fetch("/api/auth/validate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.ok;
    }

    const getLocalSession = async () => {
      const localSession = JSON.parse(localStorage.getItem("session"));
      if (localSession) {
        const isValid = await verifySession(localSession.token)        
        if (isValid) {
          setSession({...localSession,status:"authenticated"});
          return
        } else {
          localStorage.removeItem("session");
          setSession((old) => ({...old,status:"unauthenticated"}))
        }
        return
      }
      setSession((old) => ({...old,status:"unauthenticated"}))
    }
    getLocalSession();
  }, []);

  const signOut = () => {
    localStorage.removeItem("session");
    setSession({user:null,token:null,status:"unauthenticated"})
  }

  const logIn = async (credentials) => {
    const {email,password} = {email:credentials.get("email"),password:credentials.get("password")};
    if(validatePassword(password) !== "Password is valid."){
      toast({title:"Invalid credentials",description:validatePassword(password)})
      return
    }
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({email,password}),
    })
    if(res.ok) {
      const {user,token} = await res.json()
      console.log({user,token})
      localStorage.setItem("session", JSON.stringify({user,token}))
      setSession({user,token,status:"authenticated"})
      return
    }
    const message = await res.json()
    toast({title:"Couldn't Log in",description:message})
  }

  return (
    <SessionContext.Provider value={{session, signOut, logIn}}>
      {children}
    </SessionContext.Provider>
  );
}

const useSession = () => {
  return useContext(SessionContext);
}

export { SessionProvider, useSession };
