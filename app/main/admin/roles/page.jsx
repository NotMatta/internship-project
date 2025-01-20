"use client"
import { useAdmin } from "@/components/providers/admin-provider"
import { useEffect } from "react"

const RolesPage = () => {
  const roles = useAdmin().roles
  useEffect(() => {
    console.log("Roles loaded", roles)
  }, [roles])

  if(!roles) return <div>Loading...</div>
  return(
    <div className="flex flex-col gap-2">
      {roles.map((role) => (
        <div key={role.id} className="border p-4">
          <h4>{role.name}</h4>
          <p>{role.id}</p>
        </div>
      ))}
    </div>
  )
}

export default RolesPage
