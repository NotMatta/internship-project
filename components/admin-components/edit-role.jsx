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
import { SquarePen } from "lucide-react";
import { Input } from "../ui/input";
import { useAdmin } from "../providers/admin-provider";
import { useEffect, useState } from "react";
import { useSession } from "../providers/session-provider";
import { Checkbox } from "@/components/ui/checkbox"

const EditRole = ({role}) => {
  const permissions = useSession().session.user.permissions || [];
  const {editRole,mutationStatus,setMutationStatus} = useAdmin()
  const [res, setResponse] = useState("none");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMutationStatus("loading")
    const formData = new FormData(e.target);
    if(role.name == formData.get("name") && role.permissions == formData.get("permissions")){
      toast({title:"Invalid",description:"No changes made to the role"})
      setResponse("invalid");
      setMutationStatus("none")
      return
    }
    editRole.mutate(formData)
  }

  useEffect(() => {
    if(mutationStatus == "re_success"){
      setResponse("success")
      setMutationStatus("none")
    }
    if(mutationStatus == "re_error"){
      setResponse("error")
      setMutationStatus("none")
    }
    if(mutationStatus == "re_invalid"){
      setResponse("invalid")
      setMutationStatus("none")
    }
  },[mutationStatus,setMutationStatus])

  if(!permissions.includes("WRITE_ROLES") && !permissions.includes("MASTER")) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon"><SquarePen/></Button>
      </DialogTrigger>
      <DialogContent>
      {res != "success" ? <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editing a role</DialogTitle>
          </DialogHeader>
          <DialogDescription>Fill the form below to edit the role</DialogDescription>
          <input type="hidden" name="id" value={role.id}/>
          <Input name="name" defaultValue={role.name}/>
          <p className="text-sm text-gray-500">Permissions</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {["READ_APPS","WRITE_APPS","READ_USERS","WRITE_USERS","READ_ROLES","WRITE_ROLES","READ_LOGS","WRITE_LOGS"].map((permission) => (
              <div key={permission} className="flex items-center gap-2 w-5/12">
                <Checkbox name="permissions" id={permission} value={permission} defaultChecked={role.permissions.includes(permission)}/>
                <label htmlFor={permission}>{permission}</label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="reset">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={mutationStatus == "loading"}>Edit</Button>
          </DialogFooter>
        </form> : <div className="flex flex-col items-center gap-4">
        <DialogHeader>
          <DialogTitle>Successfully edited the role!</DialogTitle>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <DialogClose asChild>
            <Button variant="outline" onClick={() => setResponse("none")}>Close</Button>
          </DialogClose>
        </DialogFooter>
      </div>}
      </DialogContent>
    </Dialog>
  )
}

export default EditRole
