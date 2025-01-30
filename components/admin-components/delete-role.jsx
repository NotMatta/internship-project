"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { useAdmin } from "../providers/admin-provider";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useSession } from "../providers/session-provider";

const DeleteRole = ({role}) => {
  const permissions = useSession().session.user.permissions || [];
  const {deleteRole,mutationStatus,setMutationStatus} = useAdmin()
  const {toast} = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMutationStatus("loading")
    const formData = new FormData(e.target);
    await deleteRole.mutate(formData);
  }

  useEffect(() => {
  if(mutationStatus == "rd_success"){
    setMutationStatus("none");
    toast({title:"Rôle supprimé",description:"Le rôle a été supprimé"});
  }
  if(mutationStatus == "rd_error"){
    setMutationStatus("none");
  }
},[mutationStatus,setMutationStatus,toast]);

  if(!permissions.includes("WRITE_ROLES") && !permissions.includes("MASTER")) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="destructive"><Trash/></Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Supprimer un rôle</DialogTitle>
          </DialogHeader>
          <DialogDescription>Êtes-vous sûr de vouloir supprimer le rôle ?</DialogDescription>
          <input type="hidden" name="id" defaultValue={role.id}/>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline" type="reset">Annuler</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="destructive" type="submit">Supprimer</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteRole
