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
import { Eye, EyeOff, SquarePen } from "lucide-react";
import { Input } from "./ui/input";
import { useApplications } from "./providers/applications-provider";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const EditApp = ({application}) => {

  const {editApplication,mutationStatus,setMutationStatus} = useApplications()
  const [displayPassword,setDisplayPassword] = useState(false);
  const [logo, setLogo] = useState(application.logo);
  const [res, setResponse] = useState("none");
  const {toast} = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if(application.name == formData.get("name") && application.login == formData.get("login") && application.password == formData.get("password") && application.logo == formData.get("logo") && application.address == formData.get("address") && application.type == formData.get("type")){
      toast({title:"Invalid",description:"No changes made to the application"})
      setResponse("invalid");
      return
    }
    setMutationStatus("loading")
    await editApplication.mutate(formData);
  }

  useEffect(() => {
    if(mutationStatus == "e_success"){
      setResponse("success")
      setMutationStatus("none")
    }
    if(mutationStatus == "e_error"){
      setResponse("error")
      setMutationStatus("none")
      toast({title:"Failed to edit application",description:"An error occured while editing the application"})
    }
  },[mutationStatus,setMutationStatus,toast])

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
            <input type="hidden" name="id" defaultValue={application.id}/>
            <div className="flex gap-2 items-center">
              <Input name="logo" type="text" placeholder="Logo url ~ " value={logo} onChange={e => setLogo(e.target.value)}/>
              <img src={logo ? logo : "https://cdn.icon-icons.com/icons2/2483/PNG/512/application_icon_149973.png"} alt="logo" className="w-12 h-12"/>
            </div>
            <Input name="name" type="text" placeholder="Application Name" required defaultValue={application.name}/>
            <div className="flex gap-2">
              <Input name="address" type="text" placeholder="Address" required defaultValue={application.address}/>
                <Select name="type" required={true} defaultValue={application.type}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Address type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="URL">URL</SelectItem>
                    <SelectItem value="IP">IP</SelectItem>
                  </SelectContent>
                </Select>             
            </div>
            <Input name="login" type="text" placeholder="Username / Email / Phone.." required defaultValue={application.login}/>
            <div className="flex gap-2">
              <Input name="password" type={displayPassword ? "text" : "password"} placeholder="Password" required defaultValue={application.password}/>
              <Button type="button" variant="outline" onClick={() => setDisplayPassword(!displayPassword)} size="icon">{displayPassword ? <Eye/> : <EyeOff/>}</Button>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={mutationStatus == "loading"}>Save Edit</Button>
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
