"use client"
import { useAdmin } from "@/components/providers/admin-provider"
import { useSession } from "@/components/providers/session-provider"
import { redirect } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import AddRole from "@/components/admin-components/add-role"
import EditRole from "@/components/admin-components/edit-role"
import DeleteRole from "@/components/admin-components/delete-role"

const RolesPage = () => {
  const {session} = useSession()
  const {toast} = useToast()
  if(!session.user.permissions.includes("READ_ROLES") && !session.user.permissions.includes("MASTER")){
    toast({title:"Unauthorized",description:"You do not have permission to view this page."})
    redirect("/profile")
  }
  const roles = useAdmin().roles

  if(!roles) return <div>Loading...</div>
  return(
    <div className="flex flex-col gap-9 overflow-y-scroll max-h-full">
      <div className="flex justify-between">
        <h1>Roles</h1>
        <AddRole/>
      </div>
      <div className="flex flex-col gap-2">
        {roles.map((role) => (
          <div key={role.id} className="border p-4 rounded-2xl flex justify-between">
            <div>
              <h4>{role.name}</h4>
              <p>id: {role.id}</p>
              <div className="flex flex-wrap gap-2 items-center">Permissions:
                {role.permissions.map((permission,k) => (
                  <p key={k} className="bg-secondary text-xs py-1 px-2 rounded-2xl">
                    {permission}
                  </p>)
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <EditRole role={role}/>
              <DeleteRole role={role}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RolesPage
