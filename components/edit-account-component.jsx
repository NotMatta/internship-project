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
import { SquarePen } from "lucide-react";
import { Input } from "./ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { useCredentials } from "./providers/credentials-provider";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const EditAccount = ({account}) => {

  const {editCredential} = useCredentials()
  const [res, setResponse] = useState("none");
  const {toast} = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if(!formData.get("name") || !formData.get("email") || !formData.get("password")){
      setResponse("invalid");
      return
    }
    if(account.name == formData.get("name") && account.email == formData.get("email") && account.password == formData.get("password")){
      console.log("No changes made")
      setResponse("invalid");
      return
    }
    await editCredential.mutate(formData);
    if(editCredential.isError){
      setResponse("error");
      toast({title:"Failed to edit account",description:"An error occured while editing the account"})

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
            <DialogTitle>Editing an account</DialogTitle>
          </DialogHeader>
          <DialogDescription>Fill in the form below to edit this account</DialogDescription>
          {res == "invalid" && <DialogDescription className="text-red-500">*Make sure you provide valid inputs</DialogDescription>}
          <div className="space-y-2">
            <Input name="name" type="text" placeholder="Account Name" defaultValue={account.name} required/>
            <Input name="email" type="email" placeholder="Email" defaultValue={account.email} required/>
            <Input name="password" type="password" placeholder="Password" defaultValue={account.password} required/>
            <input type="hidden" name="id" defaultValue={account.id}/>
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

export default EditAccount
