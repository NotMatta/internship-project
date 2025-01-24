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
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { useApplications } from "./providers/applications-provider";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useSession  } from "./providers/session-provider";

const DeleteApp = ({application}) => {

  const permissions = useSession().session.user.permissions || [];
  const {deleteApplication,mutationStatus,setMutationStatus} = useApplications()
  const {toast} = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMutationStatus("loading")
    const formData = new FormData(e.target);
    await deleteApplication.mutate(formData);
  }

  useEffect(() => {
    if(mutationStatus == "d_success"){
      setMutationStatus("none")
      toast({title:"Application deleted",description:"The application has been deleted"})
    }
    if(mutationStatus == "d_error"){
      setMutationStatus("none")
      toast({title:"Failed to delete application",description:"An error occured while deleting the application"})
    }
  },[mutationStatus,setMutationStatus,toast])

  if(!permissions.includes("WRITE_APPLICATIONS") && !permissions.includes("MASTER")) return null

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
              <Button type="submit" variant="destructive" disabled={mutationStatus == "loading"}>Delete Application</Button>
            </DialogClose>
          </DialogFooter>
        </form>      
      </DialogContent>
    </Dialog>
  );
}

export default DeleteApp
