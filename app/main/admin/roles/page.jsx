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
