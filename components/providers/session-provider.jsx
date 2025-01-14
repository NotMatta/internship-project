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
      console.log("res of validation",res)
      return true;
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

  const signUp = async (credentials) => {
    const {name,email,password,cpassword} = {name:credentials.get("name"),email:credentials.get("email"),password:credentials.get("password"),cpassword:credentials.get("cpassword")};
    console.log("Signing in",credentials);
    if(validateUsername(name) !== "Username is valid."){
      toast({title:"Invalid credentials",description:validateUsername(name)})
      return
    }
    if(password !== cpassword){
      toast({title:"Invalid credentials",description:"Passwords do not match"})     
      return
    }
    if(validatePassword(password) !== "Password is valid."){
      toast({title:"Invalid credentials",description:validatePassword(password)})
      return
    }
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({name,email,password}),
    })
    
    if(res.ok) {
      const {user,token} = await res.json()
      console.log({user,token})
      localStorage.setItem("session", JSON.stringify({user,token}))
      setSession({user,token,status:"authenticated"})
      return
    }
    const message = await res.json()
    toast({title:"Couldn't create an account",description:message})
    
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
    toast({title:"Couldn't create an account",description:message})
  }

  return (
    <SessionContext.Provider value={{session, signOut, signUp, logIn}}>
      {children}
    </SessionContext.Provider>
  );
}

const useSession = () => {
  return useContext(SessionContext);
}

export { SessionProvider, useSession };
