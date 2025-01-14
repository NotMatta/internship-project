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

const AddAccount = () => {

  const {createCredential} = useCredentials()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon"><Plus/></Button>
      </DialogTrigger>
      <DialogContent>
        <form action={createCredential}>
          <DialogHeader>
            <DialogTitle>Adding a new account</DialogTitle>
          </DialogHeader>
          <DialogDescription>Fill in the form below to add a new account</DialogDescription>
          <div className="space-y-2">
            <Input name="name" type="text" placeholder="Account Name" required/>
            <Input name="website" type="text" placeholder="Website Address (optional)" required/>
            <Input name="email" type="email" placeholder="Email" required/>
            <Input name="password" type="password" placeholder="Password" required/>
          </div>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Add Account</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddAccount;
