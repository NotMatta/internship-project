"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";
import { useCredentials } from "./providers/credentials-provider";
import { useToast } from "@/hooks/use-toast";

const DeleteApp = ({application}) => {

  const {deleteCredential} = useCredentials()
  const {toast} = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await deleteCredential.mutate(formData);
    if(deleteCredential.isError){
      toast({title:"Failed to delete application",description:"An error occured while deleting the application"})
      return
    }
    toast({title:"Account deleted",description:"The account has been deleted"})
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="destructive"><Trash/></Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Deleting an application</DialogTitle>
          </DialogHeader>
          <DialogDescription>Are you sure you want to delete the application?</DialogDescription>
          <input type="hidden" name="id" defaultValue={application.id}/>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" variant="destructive">Delete Application</Button>
            </DialogClose>
          </DialogFooter>
        </form>      
      </DialogContent>
    </Dialog>
  );
}

export default DeleteApp
