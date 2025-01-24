"use client"
import { useContext, createContext, useEffect, useState } from "react";
import { useSession } from "./session-provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const applicationsContext = createContext();

const ApplicationsContextProvider = ({ children }) => {
  const [mutationStatus,setMutationStatus] = useState("none")
  const { session } = useSession();
  const queryClient = useQueryClient()

  const {data,loading,error} = useQuery({queryKey:['applications'],queryFn: async () => {
    const res = await fetch("/api/applications", {
      headers: {
        Authorization: `Bearer ${session.token}`,
      }
    })
    if(!res.ok){
      throw new Error("Failed to fetch applications")
    }
    return res.json()
  }})

  const createApplication = useMutation({
    mutationFn: async (formData) => {
      console.log("Creating applications", formData,"with",session.token);
      const { logo, name, address, type, login, password } =  {logo:formData.get("logo"),name:formData.get("name"),address:formData.get("address"),type:formData.get("type"),login:formData.get("login"),password:formData.get("password")};
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({logo,name,address,type,login,password}),
      });
      if(!res.ok) {
        setMutationStatus("a_error")
        throw new Error("Failed to create applications")
      }
      setMutationStatus("a_success")
      return res.json()
    },
    onSuccess: (newData) => {
      console.log("Applications created",newData)
      queryClient.setQueryData(['applications'],(oldData) => [...oldData,newData])
    }
  })

  const editApplication = useMutation({
    mutationFn: async (formData) => {
      console.log("Editing applications", formData,"with",session.token);
      const { logo, name, address, type, login, password, id } =  {logo:formData.get("logo"),name:formData.get("name"),address:formData.get("address"),type:formData.get("type"),login:formData.get("login"),password:formData.get("password"),id:formData.get("id")};
      const res = await fetch("/api/applications", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({logo,name,address,type,login,password,id}),
      });
      if(!res.ok) {
        setMutationStatus("e_error")
        throw new Error("Failed to edit applications")
      }
      setMutationStatus("e_success")
      return res.json()
    },
    onSuccess: (newData) => {
      console.log("Applications edited",newData)
      queryClient.setQueryData(['applications'],(oldData) => oldData.map((data) => data.id == newData.id ? newData : data))
    }
  })

  const deleteApplication = useMutation({
    mutationFn: async (formData) => {
      console.log("Deleting applications", formData,"with",session.token);
      const { id } =  {id:formData.get("id")};
      const res = await fetch("/api/applications", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({id}),
      });
      if(!res.ok) {
        setMutationStatus("d_error")
        throw new Error("Failed to delete applications")
      }
      setMutationStatus("d_success")
      return res.json()
    },
    onSuccess: (newData) => {
      console.log("Applications deleted",newData)
      queryClient.setQueryData(['applications'],(oldData) => oldData.filter((data) => data.id != newData.id))
    }
  })

  if(error) return <div>Something Happened :p</div>

  return(
    <applicationsContext.Provider value={{createApplication,editApplication,deleteApplication,applications:{data,loading,error},mutationStatus,setMutationStatus}}>
      {children}
    </applicationsContext.Provider>
  )
}

const ApplicationsProvider = ({ children }) => {
  const { session } = useSession();
  if (session.status == "authenticated") {
    return <ApplicationsContextProvider>{children}</ApplicationsContextProvider>;
  }
  return children;
}

const useApplications = () => {
  return useContext(applicationsContext);
}

export { ApplicationsProvider, useApplications };
