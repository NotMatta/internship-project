"use client"
import AddUser from "@/components/admin-components/add-user"
import EditUser from "@/components/admin-components/edit-user"
import DeleteUser from "@/components/admin-components/delete-user"
import { useAdmin } from "@/components/providers/admin-provider"
import { useEffect } from "react"

const UsersPage = () => {
  const users = useAdmin().users
  useEffect(() => {
    console.log("Users loaded", users)
  }, [users])

  if(!users) return <div>Loading...</div>
  return(
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h1>Manage Users</h1>
        <AddUser/>
      </div>
      {users.map((user) => (
        <div key={user.id} className="border p-4 flex justify-between">
          <div>
            <h4>{user.name}</h4>
            <p>{user.email}</p>
          </div>
          <div className="space-x-2">
            <EditUser user={user}/>
            <DeleteUser user={user}/>
          </div>
        </div>
      ))}
    </div>
  )
}

export default UsersPage
