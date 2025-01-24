"use client"
import { useAdmin } from "@/components/providers/admin-provider"
import { useEffect } from "react"
import { useSession } from "@/components/providers/session-provider"
import { redirect } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const RolesPage = () => {
  const {session} = useSession()
  const {toast} = useToast()
  if(!session.user.permissions.includes("READ_ROLES") && !session.user.permissions.includes("MASTER")){
    toast({title:"Unauthorized",description:"You do not have permission to view this page."})
    redirect("/profile")
  }
  const roles = useAdmin().roles
  useEffect(() => {
    console.log("Roles loaded", roles)
  }, [roles])

  if(!roles) return <div>Loading...</div>
  return(
    <div className="flex flex-col gap-9">
      <h1>Roles</h1>
      <div className="flex flex-col gap-2">
        {roles.map((role) => (
          <div key={role.id} className="border p-4 bg-secondary rounded-2xl">
            <h4>{role.name}</h4>
            <p>id: {role.id}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RolesPage
