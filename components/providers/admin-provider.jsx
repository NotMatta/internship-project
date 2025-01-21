"use client"
import { useContext, createContext, useState, useEffect } from "react"
import { useSession } from "./session-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query"

const AdminContext = createContext()

export const AdminProvider = ({children}) => {

  const queryClient = useQueryClient()
  const [verified, setVerified] = useState(false)
  const [mutationStatus,setMutationStatus] = useState("none")
  const { session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const users = useQuery({queryKey:['users'],queryFn: async () => {
    const res = await fetch("/api/admin/users", {
      headers: {
        Authorization: `Bearer ${session.token}`,
      }
    })
    if(!res.ok){
      throw new Error("Failed to fetch users")
    }
    return res.json()
    },
    enabled: verified
  }).data
  const roles = useQuery({queryKey:['roles'],queryFn: async () => {
    const res = await fetch("/api/admin/roles", {
      headers: {
        Authorization: `Bearer ${session.token}`,
      }
    })
    if(!res.ok){
      throw new Error("Failed to fetch roles")
    }
    return res.json()
    },
    enabled: verified
  }).data

  useEffect(() => {
    const validateAdmin = async () => {
      const res = await fetch("/api/auth/validate", {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      })
      if (!res.ok) {
        toast({ title: "Unauthorized", description: "You are not authorized to view this page" })
        router.push("/main/dashboard")
        return
      }
      const data = await res.json()
      if (data.user.role.name !== "ADMIN") {
        toast({ title: "Unauthorized", description: "You are not authorized to view this page" })
        router.push("/main/dashboard")
        return
      }
      setVerified(true)
    }
    if (verified) return
    validateAdmin()
  }, [session.token, toast, verified, router])

  const createUser = useMutation({
    mutationFn: async (formData) => {
      console.log("Creating a User", formData,"with",session.token);
      const { name, email, password, roleId} = {name:formData.get("name"),email:formData.get("email"),password:formData.get("password"),roleId:formData.get("roleId")};
      const res = await fetch("/api/admin/users/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({name,email,password,roleId}),
      });
      if(!res.ok) {
        setMutationStatus("u_error")
        throw new Error("Failed to create user")
      }
      setMutationStatus("u_success")
      return res.json()
    },
    onSuccess: (newData) => {
      console.log("User Created",newData)
      queryClient.setQueryData(['users'],(oldData) => [...oldData,newData])
    }
  })

  const editUser = useMutation({
    mutationFn: async (formData) => {
      console.log("Editing a User", formData,"with",session.token);
      const { name, email, password, roleId, id } = {name:formData.get("name"),email:formData.get("email"),password:formData.get("password"),roleId:formData.get("roleId"),id:formData.get("id")};
      const res = await fetch("/api/admin/users/", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({name,email,password,roleId,id}),
      });
      if(!res.ok) {
        setMutationStatus("ue_error")
        throw new Error("Failed to edit user")
      }
      setMutationStatus("ue_success")
      return res.json()
    },
    onSuccess: (newData) => {
      console.log("User Edited",newData)
      queryClient.setQueryData(['users'],(oldData) => oldData.map((user) => user.id == newData.id ? newData : user))
    }
  })

  const deleteUser = useMutation({
    mutationFn: async (formData) => {
      console.log("Deleting a User", formData,"with",session.token);
      const { id } = {id:formData.get("id")};
      const res = await fetch("/api/admin/users/", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({id}),
      });
      if(!res.ok) {
        setMutationStatus("ud_error")
        throw new Error("Failed to delete user")
      }
      setMutationStatus("ud_success")
      return res.json()
    },
    onSuccess: (newData) => {
      console.log("User Deleted",newData)
      queryClient.setQueryData(['users'],(oldData) => oldData.filter((user) => user.id !== newData.id))
    }
  })

  if (!verified || !users || !roles) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    )
  }

  return (
    <AdminContext.Provider value={{users,roles,createUser,editUser,deleteUser,mutationStatus,setMutationStatus}}>{children}</AdminContext.Provider>
  )
}

export const useAdmin = () => {
  return useContext(AdminContext)
}
