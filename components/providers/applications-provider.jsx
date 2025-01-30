"use client"
import { useContext, createContext, useState } from "react";
import { useSession } from "./session-provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isValidIP, isValidURL } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const applicationsContext = createContext();

const ApplicationsContextProvider = ({ children }) => {
  const [mutationStatus,setMutationStatus] = useState("none")
  const {toast} = useToast()
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
    },
    enabled: session.status == "authenticated" && session.user.permissions.includes("READ_APPS")
  })

  const createApplication = useMutation({
    mutationFn: async (formData) => {
      const { logo, name, address, type, login, password } =  {logo:formData.get("logo"),name:formData.get("name"),address:formData.get("address"),type:formData.get("type"),login:formData.get("login"),password:formData.get("password")};
      if(type == "URL" && !isValidURL(address) || type == "IP" && !isValidIP(address)){
        setMutationStatus("a_error");
        toast({title:"Adresse invalide",description:"Veuillez saisir une adresse valide"});
        throw new Error("Adresse invalide");
      }
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({logo,name,address,type,login,password}),
      });
      if(!res.ok) {
        setMutationStatus("a_error");
        const message = await res.json();
        toast({title:"Erreur",description:message});
        throw new Error("Échec de la création des applications");
      }
      setMutationStatus("a_success");
      return res.json();
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(['applications'],(oldData) => [...oldData,newData]);
    }
  });
  
  const editApplication = useMutation({
    mutationFn: async (formData) => {
      const { logo, name, address, type, login, password, id } =  {logo:formData.get("logo"),name:formData.get("name"),address:formData.get("address"),type:formData.get("type"),login:formData.get("login"),password:formData.get("password"),id:formData.get("id")};
      if(type == "URL" && !isValidURL(address) || type == "IP" && !isValidIP(address)){
        setMutationStatus("a_error");
        toast({title:"Adresse invalide",description:"Veuillez saisir une adresse valide"});
        throw new Error("Adresse invalide");
      }
      const res = await fetch("/api/applications", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({logo,name,address,type,login,password,id}),
      });
      if(!res.ok) {
        setMutationStatus("e_error");
        const message = await res.json();
        toast({title:"Erreur",description:message});
        throw new Error("Échec de la modification des applications");
      }
      setMutationStatus("e_success");
      return res.json();
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(['applications'],(oldData) => oldData.map((data) => data.id == newData.id ? newData : data));
    }
  });

  const deleteApplication = useMutation({
    mutationFn: async (formData) => {
      const { id } =  {id:formData.get("id")};
      const res = await fetch("/api/applications", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({id}),
      });
      if(!res.ok) {
        setMutationStatus("d_error");
        throw new Error("Échec de la suppression des applications");
      }
      setMutationStatus("d_success");
      return res.json();
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(['applications'],(oldData) => oldData.filter((data) => data.id != newData.id));
    }
  });
  
  if(error) return <div>Une erreur s&apos;est produite</div>;


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
