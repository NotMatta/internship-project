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

const DeleteUser = ({user}) => {

  const permissions = useSession().session.user.permissions || [];
  const {deleteUser,mutationStatus,setMutationStatus} = useAdmin()
  const {toast} = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMutationStatus("loading")
    const formData = new FormData(e.target);
    await deleteUser.mutate(formData);
  }

  useEffect(() => {
    if(mutationStatus == "ud_success"){
      setMutationStatus("none");
      toast({title:"Utilisateur supprimé",description:"L'utilisateur a été supprimé"});
    }
    if(mutationStatus == "ud_error"){
      setMutationStatus("none");
    }
  },[mutationStatus,setMutationStatus,toast]);

  if(!permissions.includes("WRITE_USERS") && !permissions.includes("MASTER")) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="destructive"><Trash/></Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Supprimer un utilisateur</DialogTitle>
          </DialogHeader>
          <DialogDescription>Êtes-vous sûr de vouloir supprimer l&apos;utilisateur ?</DialogDescription>
          <input type="hidden" name="id" defaultValue={user.id}/>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" variant="destructive" disabled={mutationStatus == "loading"}>Supprimer l&apos;utilisateur</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteUser
