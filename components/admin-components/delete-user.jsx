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

const DeleteUser = ({user}) => {

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
      setMutationStatus("none")
      toast({title:"User deleted",description:"The user has been deleted"})
    }
    if(mutationStatus == "ud_error"){
      setMutationStatus("none")
      toast({title:"Failed to delete user",description:"An error occured while deleting the user"})
    }
  },[mutationStatus,setMutationStatus,toast])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="destructive"><Trash/></Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Deleting an user</DialogTitle>
          </DialogHeader>
          <DialogDescription>Are you sure you want to delete the user?</DialogDescription>
          <input type="hidden" name="id" defaultValue={user.id}/>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" variant="destructive" disabled={mutationStatus == "loading"}>Delete User</Button>
            </DialogClose>
          </DialogFooter>
        </form>      
      </DialogContent>
    </Dialog>
  );
}

export default DeleteUser
