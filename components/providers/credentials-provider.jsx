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
    const { name, username, password } =  {name:formData.get("name"),username:formData.get("username"),password:formData.get("password")};
      const res = await fetch("/api/credentials", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({name,username,password}),
      });
      if(!res.ok) throw new Error("Failed to create credentials")
      return res.json()
    },
    onSuccess: (newData) => {
      console.log("Credentials created",newData)
      queryClient.setQueryData(['credentials'],(oldData) => [...oldData,newData])
    }
  })

  const editCredential = useMutation({
    mutationFn: async (formData) => {
      console.log("Editing credentials", formData,"with",session.token);
      const { name, username, password, id } =  {name:formData.get("name"),username:formData.get("username"),password:formData.get("password"),id:formData.get("id")};
      console.log({name,username,password,id})
      const res = await fetch("/api/credentials", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({name,username,password,id}),
      });
      if(!res.ok) throw new Error("Failed to edit credentials")
      return res.json()
    },
    onSuccess: (newData) => {
      console.log("Credentials edited",newData)
      queryClient.setQueryData(['credentials'],(oldData) => oldData.map((data) => data.id == newData.id ? newData : data))
    }
  })

  const deleteCredential = useMutation({
    mutationFn: async (formData) => {
      console.log("Deleting credentials", formData,"with",session.token);
      const { id } =  {id:formData.get("id")};
      const res = await fetch("/api/credentials", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({id}),
      });
      if(!res.ok) throw new Error("Failed to delete credentials")
      return res.json()
    },
    onSuccess: (newData) => {
      console.log("Credentials deleted",newData)
      queryClient.setQueryData(['credentials'],(oldData) => oldData.filter((data) => data.id != newData.id))
    }
  })

  if(error) return <div>Something Happened :p</div>

  return(
    <credentialsContext.Provider value={{createCredential,editCredential,deleteCredential,credentials:{data,loading,error}}}>
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
