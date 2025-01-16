"use client"
import { useContext, createContext, useEffect, useState } from "react";
import { useSession } from "./session-provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const credentialsContext = createContext();

const CredentialsContextProvider = ({ children }) => {
  const { session } = useSession();
  console.log("Credentials provider loaded !");

  const queryClient = useQueryClient()

  const {data,loading,error} = useQuery({queryKey:['credentials'],queryFn: async () => {
    const res = await fetch("/api/credentials", {
      headers: {
        Authorization: `Bearer ${session.token}`,
      }
    })
    if(!res.ok){
      throw new Error("Failed to fetch credentials")
    }
    return res.json()
  }})

  const createCredential = useMutation({
    mutationFn: async (formData) => {
      console.log("Creating credentials", formData,"with",session.token);
    const { name, email, password } =  {name:formData.get("name"),email:formData.get("email"),password:formData.get("password")};
      const res = await fetch("/api/credentials", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({name,email,password}),
      });
      if(!res.ok) throw new Error("Failed to create credentials")
      return res.json()
    },
    onError: (error) => {
      console.log("Error creating credentials",error)
    },
    onSuccess: (newData) => {
      console.log("Credentials created",newData)
      queryClient.setQueryData(['credentials'],(oldData) => [...oldData,newData])
    }
  })

  if(error) return <div>Something Happened :p</div>

  return(
    <credentialsContext.Provider value={{createCredential,credentials:{data,loading,error}}}>
      {children}
    </credentialsContext.Provider>
  )
}

const CredentialsProvider = ({ children }) => {
  const { session } = useSession();
  if (session.status == "authenticated") {
    return <CredentialsContextProvider>{children}</CredentialsContextProvider>;
  }
  return children;
}

const useCredentials = () => {
  return useContext(credentialsContext);
}

export { CredentialsProvider, useCredentials };
