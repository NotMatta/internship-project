"use client"
import AddUser from "@/components/admin-components/add-user"
import EditUser from "@/components/admin-components/edit-user"
import DeleteUser from "@/components/admin-components/delete-user"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "@/components/providers/session-provider"
import { useAdmin } from "@/components/providers/admin-provider"
import { redirect } from "next/navigation"

const UsersPage = () => {
  const {toast} = useToast();
  const {session} = useSession();
  if(!session.user.permissions.includes("READ_USERS") && !session.user.permissions.includes("MASTER")){
    toast({title:"Non autorisé",description:"Vous n'avez pas la permission de voir cette page."});
    redirect("/profile");
  }
  
  const users = useAdmin().users;
  
  if(!users) return <div>Chargement...</div>;
  return(
    <div className="flex flex-col gap-9 overflow-y-scroll max-h-full">
      <div className="flex justify-between items-center">
        <h1>Gérer les utilisateurs</h1>
        <AddUser/>
      </div>
      <div className="flex flex-col gap-2">
        {users.map((user) => (
          <div key={user.id} className="border p-4 flex justify-between rounded-2xl">
            <div>
              <h4>{user.name}</h4>
              <p>{user.email}</p>
              <p>Rôle : {user.role.name}</p>
            </div>
            <div className="space-x-2">
              <EditUser user={user}/>
              <DeleteUser user={user}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UsersPage
