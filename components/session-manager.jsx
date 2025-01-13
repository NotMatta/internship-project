"use client"
import { createContext, useState, useEffect, useContext } from "react";

const SessionContext = createContext();

const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  
  const verifySession = async () => {
    //send the token to the server to verify it returning true or false
    console.log("Verifying session");
    return True
  }

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("session"));
    if (session) {
      verifySession(session.token).then((isValid) => {
        if (isValid) {
          setSession(session);
        } else {
          localStorage.removeItem("session");
          setSession(null);
        }
      });
    }
  }, []);

  const signOut = () => {
    localStorage.removeItem("session");
    setSession(null);
  }

  const signUp = (credentials) => {
    //send the credentials to the server to get a token
    console.log("Signing in",credentials);
  }

  const LogIn = (credentials) => {
    //send the credentials to the server to get a token
    console.log("Logging in",credentials);
  }

  return (
    <SessionContext.Provider value={{session, signOut, signUp, LogIn}}>
      {children}
    </SessionContext.Provider>
  );
}

const useSession = () => {
  return useContext(SessionContext);
}

export { SessionProvider, useSession };
