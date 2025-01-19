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
import { Eye, EyeOff, SquarePen } from "lucide-react";
import { Input } from "./ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { useCredentials } from "./providers/credentials-provider";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const EditApp = ({application}) => {

  const {editCredential} = useCredentials()
  const [displayPassword,setDisplayPassword] = useState(false);
  const [res, setResponse] = useState("none");
  const {toast} = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if(!formData.get("name") || !formData.get("username") || !formData.get("password")){
      setResponse("invalid");
      return
    }
    if(application.name == formData.get("name") && application.username == formData.get("username") && application.password == formData.get("password")){
      toast({title:"Invalid",description:"No changes made to the application"})
      setResponse("invalid");
      return
    }
    await editCredential.mutate(formData);
    if(editCredential.isError){
      setResponse("error");
      toast({title:"Failed to edit application",description:"An error occured while editing the application"})
      return
    }
    setResponse("success");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon"><SquarePen/></Button>
      </DialogTrigger>
      <DialogContent>
        {res != "success" ? <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editing an application</DialogTitle>
          </DialogHeader>
          <DialogDescription>Fill in the form below to edit this application</DialogDescription>
          {res == "invalid" && <DialogDescription className="text-red-500">*Make sure you provide valid inputs</DialogDescription>}
          <div className="space-y-2">
            <Input name="name" type="text" placeholder="Account Name" defaultValue={application.name} required/>
            <Input name="username" type="text" placeholder="Username..." defaultValue={application.username} required/>
            <div className="flex gap-2">
              <Input name="password" type={displayPassword ? "text" : "password"} placeholder="Password" defaultValue={application.password} required/>
              <Button type="button" variant="outline" onClick={() => setDisplayPassword(!displayPassword)} size="icon">{displayPassword ? <Eye/> : <EyeOff/>}</Button>
            </div>
            <input type="hidden" name="id" defaultValue={application.id}/>
          </div>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save Edit</Button>
          </DialogFooter>
        </form>:
          <div>
          <DialogHeader>
            <DialogTitle>Successfully Saved the edit!</DialogTitle>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button onClick={() => setResponse("none")}>Close</Button>
            </DialogClose>
          </DialogFooter>
          </div>
        }
      </DialogContent>
    </Dialog>
  );
}

export default EditApp
