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
import { Plus } from "lucide-react";
import { Input } from "./ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { useCredentials } from "./providers/credentials-provider";
import { useState } from "react";

const AddAccount = () => {

  const {createCredential} = useCredentials()
  const [res, setResponse] = useState("none");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if(!formData.get("name") || !formData.get("email") || !formData.get("password")){
      setResponse("invalid");
      return
    }
    createCredential.mutate(formData);
    if(createCredential.isError){
      setResponse("error");
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
            <DialogTitle>Adding a new account</DialogTitle>
          </DialogHeader>
          <DialogDescription>Fill in the form below to add a new account</DialogDescription>
          {res == "invalid" && <DialogDescription className="text-red-500">*Make sure you provide valid inputs</DialogDescription>}
          <div className="space-y-2">
            <Input name="name" type="text" placeholder="Account Name" required/>
            <Input name="email" type="email" placeholder="Email" required/>
            <Input name="password" type="password" placeholder="Password" required/>
          </div>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Add Account</Button>
          </DialogFooter>
        </form>:
          <div>
          <DialogHeader>
            <DialogTitle>Successfully added a new account!</DialogTitle>
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

export default AddAccount;
