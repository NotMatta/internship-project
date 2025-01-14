"use client"
import { useContext, createContext, useEffect, useState } from "react";
import { useSession } from "./session-provider";

const credentialsContext = createContext();

const CredentialsProvider = ({ children }) => {
  const { session } = useSession();
  console.log("Credentials provider loaded !");

  const createCredential = async (formData) => {
    alert("Creating credentials");
    console.log("Creating credentials", formData,"with",session.token);
    const { name, website, email, password } =  {name:formData.get("name"),website:formData.get("website"),email:formData.get("email"),password:formData.get("password")};
      const res = await fetch("/api/credentials", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify({ name, website, email, password }),
    });
    console.log((await res.json()))
  }

  return(
    <credentialsContext.Provider value={{createCredential}}>
      {children}
    </credentialsContext.Provider>
  )
}

const useCredentials = () => {
  return useContext(credentialsContext);
}

export { CredentialsProvider, useCredentials };
