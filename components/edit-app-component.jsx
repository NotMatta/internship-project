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
import { useSession } from "./providers/session-provider";

const EditApp = ({application}) => {

  const permissions = useSession().session.user.permissions || [];
  const {editApplication,mutationStatus,setMutationStatus} = useApplications()
  const [displayPassword,setDisplayPassword] = useState(false);
  const [logo, setLogo] = useState(application.logo);
  const [res, setResponse] = useState("none");
  const {toast} = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (application.name == formData.get("name") && application.login == formData.get("login") && application.password == formData.get("password") && application.logo == formData.get("logo") && application.address == formData.get("address") && application.type == formData.get("type")) {
      toast({ title: "Invalide", description: "Aucune modification n'a été apportée à l'application" });
      setResponse("error");
      return;
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
    }
  },[mutationStatus,setMutationStatus,toast])


  if(!permissions.includes("WRITE_APPS") && !permissions.includes("MASTER")) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon"><SquarePen/></Button>
      </DialogTrigger>
      <DialogContent>
        {res != "success" ? <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Modifier une application</DialogTitle>
          </DialogHeader>
          <DialogDescription>Remplissez le formulaire ci-dessous pour modifier cette application</DialogDescription>
          <div className="space-y-2">
            <input type="hidden" name="id" defaultValue={application.id}/>
            <div className="flex gap-2 items-center">
              <Input name="logo" type="text" placeholder="URL du logo ~ " value={logo} onChange={e => setLogo(e.target.value)}/>
              <img src={logo ? logo : "https://cdn.icon-icons.com/icons2/2483/PNG/512/application_icon_149973.png"} alt="logo" className="w-12 h-12"/>
            </div>
            <Input name="name" type="text" placeholder="Nom de l'application" required defaultValue={application.name}/>
            <div className="flex gap-2">
              <Input name="address" type="text" placeholder="Adresse" required defaultValue={application.address}/>
              <Select name="type" required={true} defaultValue={application.type}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type d'adresse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="URL">URL</SelectItem>
                  <SelectItem value="IP">IP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input name="login" type="text" placeholder="Nom d'utilisateur / E-mail / Téléphone.." required defaultValue={application.login}/>
            <div className="flex gap-2">
              <Input name="password" type={displayPassword ? "text" : "password"} placeholder="Mot de passe" required defaultValue={application.password}/>
              <Button type="button" variant="outline" onClick={() => setDisplayPassword(!displayPassword)} size="icon">{displayPassword ? <Eye/> : <EyeOff/>}</Button>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button type="submit" disabled={mutationStatus == "loading"}>Enregistrer les modifications</Button>
          </DialogFooter>
        </form>:
        <div>
          <DialogHeader>
            <DialogTitle>Modifications enregistrées avec succès !</DialogTitle>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button onClick={() => setResponse("none")}>Fermer</Button>
            </DialogClose>
          </DialogFooter>
        </div>
        }
      </DialogContent>
    </Dialog>
  );
}

export default EditApp
