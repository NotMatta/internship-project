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
import { Button } from "../ui/button";
import { Plus, Eye, EyeOff } from "lucide-react";
import { Input } from "../ui/input";
import { useAdmin } from "../providers/admin-provider";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSession } from "../providers/session-provider";


const AddUser = () => {

  const permissions = useSession().session.user.permissions || []
  const {createUser,roles,mutationStatus,setMutationStatus} = useAdmin()
  const [displayPassword,setDisplayPassword] = useState(false);
  const [res, setResponse] = useState("none");
  const {toast} = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMutationStatus("loading")
    const formData = new FormData(e.target);
    console.log(formData)
    createUser.mutate(formData)
  }

  useEffect(() => {
    if(mutationStatus == "u_success"){
      setResponse("success")
      setMutationStatus("none")
    }
    if(mutationStatus == "u_error"){
      setResponse("error")
      setMutationStatus("none")
      toast({title:"Failed to add user",description:"An error occured while adding the user"})
    }
    if(mutationStatus == "u_invalid"){
      setResponse("invalid")
      setMutationStatus("none")
    }
  },[mutationStatus,setMutationStatus,toast])

  if((!permissions.includes("WRITE_USERS") || !permissions.includes("READ_ROLES") || !roles)  && !permissions.includes("MASTER")) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon"><Plus/></Button>
      </DialogTrigger>
      <DialogContent>
        {res != "success" ? <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Adding a new user</DialogTitle>
          </DialogHeader>
          <DialogDescription>Fill in the form below to add a new user</DialogDescription>
          {res == "invalid" && <DialogDescription className="text-red-500">*Make sure you provide valid inputs</DialogDescription>}
          <div className="space-y-2 mt-2">
            <Input name="name" type="text" placeholder="Name" required/>
            <Input name="email" type="email" placeholder="Email" required/>
            <div className="flex gap-2">
              <Input name="password" type={displayPassword ? "text" : "password"} placeholder="Password" required/>
              <Button type="button" variant="outline" onClick={() => setDisplayPassword(!displayPassword)} size="icon">{displayPassword ? <Eye/> : <EyeOff/>}</Button>
            </div>
            <Select name="roleId" required={true}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>)}
              </SelectContent>
            </Select>             
          </div>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={mutationStatus == "loading"}>Add User</Button>
          </DialogFooter>
        </form>:
          <div>
          <DialogHeader>
            <DialogTitle>Successfully added a new user!</DialogTitle>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setResponse("none")}>Close</Button>
            </DialogClose>
            <Button onClick={() => setResponse("none")}>Add Another</Button>
          </DialogFooter>
          </div>
        }
      </DialogContent>
    </Dialog>
  );
}

export default AddUser
