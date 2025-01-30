"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Input } from "../ui/input";
import { useAdmin } from "../providers/admin-provider";
import { useEffect, useState } from "react";
import { useSession } from "../providers/session-provider";
import { Checkbox } from "@/components/ui/checkbox"

const AddRole = () => {
  
    const permissions = useSession().session.user.permissions || []
    const {createRole,mutationStatus,setMutationStatus} = useAdmin()
    const [res, setResponse] = useState("none");
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setMutationStatus("loading")
      const formData = new FormData(e.target);
      createRole.mutate(formData)
    }
  
    useEffect(() => {
      if(mutationStatus == "r_success"){
        setResponse("success")
        setMutationStatus("none")
      }
      if(mutationStatus == "r_error"){
        setResponse("error")
        setMutationStatus("none")
      }
      if(mutationStatus == "r_invalid"){
        setResponse("invalid")
        setMutationStatus("none")
      }
    },[mutationStatus,setMutationStatus])
  
    if(!permissions.includes("WRITE_ROLES") && !permissions.includes("MASTER")) return null
  
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button size="icon"><Plus/></Button>
        </DialogTrigger>
        <DialogContent>
          {res != "success" ? <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau rôle</DialogTitle>
            </DialogHeader>
            <DialogDescription>Remplissez le formulaire ci-dessous pour ajouter un nouveau rôle</DialogDescription>
            <Input type="text" placeholder="Nom du rôle..." name="name" required/>
            <p className="text-lg">Permissions</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {["READ_USERS","WRITE_USERS","READ_APPS","WRITE_APPS","READ_ROLES","WRITE_ROLES","READ_LOGS"].map((permission) => (
                <div key={permission} className="flex items-center gap-2 w-5/12">
                  <Checkbox name="permissions" value={permission} id={permission}/>
                  <label htmlFor={permission}>{permission}</label>
                </div>
              ))}
            </div>
            <DialogFooter className="pt-2">
              <DialogClose asChild>
                <Button variant="outline" type="reset">Annuler</Button>
              </DialogClose>
              <Button type="submit" disabled={mutationStatus == "loading"}>Ajouter un rôle</Button>
            </DialogFooter>
          </form> : <div className="flex flex-col items-center gap-4">
            <DialogHeader>
              <DialogTitle>Rôle ajouté avec succès !</DialogTitle>
            </DialogHeader>
            <DialogFooter className="pt-2">
              <DialogClose asChild>
                <Button variant="outline" onClick={() => setResponse("none")}>Fermer</Button>
              </DialogClose>
              <Button onClick={() => setResponse("none")}>Ajouter un autre rôle</Button>
            </DialogFooter>
          </div>}
        </DialogContent>
      </Dialog>
    )
  }

export default AddRole
