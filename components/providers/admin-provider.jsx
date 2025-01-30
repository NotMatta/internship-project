"use client"
import { useContext, createContext, useState} from "react"
import { useSession } from "./session-provider"
import { useToast } from "@/hooks/use-toast"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query"
import { redirect } from "next/navigation"
import { isValidEmail, validatePassword, validateUsername } from "@/lib/utils"

const AdminContext = createContext()

export const AdminProvider = ({children}) => {

  const permissions = useSession().session.user.permissions || []
  const queryClient = useQueryClient()
  const [mutationStatus,setMutationStatus] = useState("none")
  const { session } = useSession()
  const { toast } = useToast()

  if(!permissions.includes("READ_USERS") && !permissions.includes("MASTER") && !permissions.includes("READ_ROLES") && !permissions.includes("READ_LOGS")){
    toast({title:"Non autorisé",description:"Vous n'avez pas la permission de voir cette page."});
    redirect("/profile")
  }      

  const users = useQuery({queryKey:['users'],queryFn: async () => {
    const res = await fetch("/api/admin/users", {
      headers: {
        Authorization: `Bearer ${session.token}`,
      }
    })
    if(!res.ok){
      if(res.status == 403){
        setViewUsers(false)
      }
      toast({title:"Erreur",description:"Échec de la récupération des utilisateurs"});
      throw new Error("Failed to fetch users")
    }
    return res.json()
    },
    enabled: permissions.includes("READ_USERS") || permissions.includes("MASTER")
  }).data

  const roles = useQuery({queryKey:['roles'],queryFn: async () => {
    const res = await fetch("/api/admin/roles", {
      headers: {
        Authorization: `Bearer ${session.token}`,
      }
    })
    if(!res.ok){
      if(res.status == 403){
        setViewRoles(false)
      }
      toast({title:"Erreur",description:"Échec de la récupération des rôles"});
      throw new Error("Failed to fetch roles")
    }
    return res.json()
    },
    enabled: permissions.includes("READ_ROLES") || permissions.includes("MASTER")
  }).data

  const createUser = useMutation({
    mutationFn: async (formData) => {
      const { name, email, password, roleId} = {name:formData.get("name"),email:formData.get("email"),password:formData.get("password"),roleId:formData.get("roleId")};
      if(!isValidEmail(email)){
        setMutationStatus("u_error")
        toast({title:"Email invalide",description:"Veuillez saisir un email valide"});
        throw new Error("Invalid email")
      }
      if(!validatePassword(password).isValid){
        setMutationStatus("u_error")
        toast({title:"Mot de passe invalide",description:validatePassword(password).message});
        throw new Error("Invalid password")
      }
      if(!validateUsername(name).isValid){
        setMutationStatus("u_error")
        toast({title:"Nom d'utilisateur invalide",description:validateUsername(name).message});
        throw new Error("Invalid username")
      }
      const res = await fetch("/api/admin/users/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({name,email,password,roleId}),
      });
      if(!res.ok) {
        setMutationStatus("u_error")
        const message = await res.json()
        toast({title:"Erreur",description:message})
        throw new Error(message)
      }
      setMutationStatus("u_success")
      return res.json()
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(['users'],(oldData) => [...oldData,newData])
    }
  })

  const editUser = useMutation({
    mutationFn: async (formData) => {
      const { name, email, password, roleId, id } = {name:formData.get("name"),email:formData.get("email"),password:formData.get("password"),roleId:formData.get("roleId"),id:formData.get("id")};
      if(!isValidEmail(email)){
        setMutationStatus("u_error");
        toast({title:"Email invalide",description:"Veuillez saisir un email valide"});
        throw new Error("Email invalide");
      }
      if(!validatePassword(password).isValid){
        setMutationStatus("u_error");
        toast({title:"Mot de passe invalide",description:validatePassword(password).message});
        throw new Error("Mot de passe invalide");
      }
      if(!validateUsername(name).isValid){
        setMutationStatus("u_error");
        toast({title:"Nom d'utilisateur invalide",description:validateUsername(name).message});
        throw new Error("Nom d'utilisateur invalide");
      }
      const res = await fetch("/api/admin/users/", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({name,email,password,roleId,id}),
      });
      if(!res.ok) {
        setMutationStatus("ue_error");
        const message = await res.json();
        toast({title:"Erreur",description:message});
        throw new Error(message);
      }
      setMutationStatus("ue_success");
      return res.json();
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(['users'],(oldData) => oldData.map((user) => user.id == newData.id ? newData : user));
    }
  });

  const deleteUser = useMutation({
    mutationFn: async (formData) => {
      const { id } = {id:formData.get("id")};
      const res = await fetch("/api/admin/users/", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({id}),
      });
      if(!res.ok) {
        setMutationStatus("ud_error");
        const message = await res.json();
        toast({title:"Erreur",description:message});
        throw new Error(message);
      }
      setMutationStatus("ud_success");
      return res.json();
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(['users'],(oldData) => oldData.filter((user) => user.id !== newData.id));
    }
  });
  
  const createRole = useMutation({
    mutationFn: async (formData) => {
      const { name, permissions } = {name:formData.get("name"),permissions:formData.getAll("permissions")};
      const res = await fetch("/api/admin/roles/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({name,permissions}),
      });
      if(!res.ok) {
        setMutationStatus("r_error");
        const message = await res.json();
        toast({title:"Erreur",description:message});
        throw new Error(message);
      }
      setMutationStatus("r_success");
      return res.json();
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(['roles'],(oldData) => [...oldData,newData]);
    }
  });

  const editRole = useMutation({
    mutationFn: async (formData) => {
      const { name, permissions, id } = {name:formData.get("name"),permissions:formData.getAll("permissions"),id:formData.get("id")};
      const res = await fetch("/api/admin/roles/", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({name,permissions,id}),
      });
      if(!res.ok) {
        setMutationStatus("re_error");
        const message = await res.json();
        toast({title:"Erreur",description:message});
        throw new Error(message);
      }
      setMutationStatus("re_success");
      return res.json();
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(['roles'],(oldData) => oldData.map((role) => role.id == newData.id ? newData : role));
    }
  });
  
  const deleteRole = useMutation({
    mutationFn: async (formData) => {
      const { id } = {id:formData.get("id")};
      const res = await fetch("/api/admin/roles/", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({id}),
      });
      if(!res.ok) {
        setMutationStatus("rd_error");
        const message = await res.json();
        toast({title:"Erreur",description:message});
        throw new Error(message);
      }
      setMutationStatus("rd_success");
      return res.json();
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(['roles'],(oldData) => oldData.filter((role) => role.id !== newData.id));
    }
  });

  if ( !users && !roles && (permissions.includes("READ_USERS") || permissions.includes("MASTER") || permissions.includes("READ_ROLES"))){
      return (
        <div>
          <h1>Loading...</h1>
        </div>
      )
    }
  return (
    <AdminContext.Provider value={{users,roles,createUser,editUser,deleteUser,createRole,editRole,deleteRole,mutationStatus,setMutationStatus}}>{children}</AdminContext.Provider>
  )
}

export const useAdmin = () => {
  return useContext(AdminContext)
}
