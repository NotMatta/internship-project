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
import { Plus, Eye, EyeOff } from "lucide-react";
import { Input } from "./ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { useCredentials } from "./providers/credentials-provider";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const AddApp = () => {

  const {createCredential} = useCredentials()
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
    await createCredential.mutate(formData);
    if(createCredential.isError){
      setResponse("error");
      toast({title:"Failed to add application",description:"An error occured while adding the application"})
      return
    }
    setResponse("success");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon"><Plus/></Button>
      </DialogTrigger>
      <DialogContent>
        {res != "success" ? <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Adding a new applicaion</DialogTitle>
          </DialogHeader>
          <DialogDescription>Fill in the form below to add a new application</DialogDescription>
          {res == "invalid" && <DialogDescription className="text-red-500">*Make sure you provide valid inputs</DialogDescription>}
          <div className="space-y-2">
            <Input name="name" type="text" placeholder="Application Name" required/>
            <Input name="username" type="text" placeholder="Username.." required/>
            <div className="flex gap-2">
              <Input name="password" type={displayPassword ? "text" : "password"} placeholder="Password" required/>
              <Button type="button" variant="outline" onClick={() => setDisplayPassword(!displayPassword)} size="icon">{displayPassword ? <Eye/> : <EyeOff/>}</Button>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Add Application</Button>
          </DialogFooter>
        </form>:
          <div>
          <DialogHeader>
            <DialogTitle>Successfully added a new application!</DialogTitle>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button onClick={() => setResponse("none")}>Add Another</Button>
          </DialogFooter>
          </div>
        }
      </DialogContent>
    </Dialog>
  );
}

export default AddApp
