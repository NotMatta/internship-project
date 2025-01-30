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
import { Plus, Eye, EyeOff } from "lucide-react";
import { Input } from "./ui/input";
import { useApplications } from "./providers/applications-provider";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSession } from "./providers/session-provider";

const defaultLogo = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWxheW91dC1ncmlkIj48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI3IiB4PSIzIiB5PSIzIiByeD0iMSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjciIHg9IjE0IiB5PSIzIiByeD0iMSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjciIHg9IjE0IiB5PSIxNCIgcng9IjEiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI3IiB4PSIzIiB5PSIxNCIgcng9IjEiLz48L3N2Zz4="


const AddApp = () => {

  const permissions = useSession().session.user.permissions || [];
  const {createApplication,mutationStatus,setMutationStatus} = useApplications()
  const [displayPassword,setDisplayPassword] = useState(false);
  const [res, setResponse] = useState("none");
  const [logo, setLogo] = useState("");
  const {toast} = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMutationStatus("loading")
    const formData = new FormData(e.target);
    if (!logo) formData.set("logo",defaultLogo)
    console.log(formData)
    createApplication.mutate(formData)
  }

  useEffect(() => {
    if(mutationStatus == "a_success"){
      setResponse("success")
      setMutationStatus("none")
    }
    if(mutationStatus == "a_error"){
      setResponse("error")
      setMutationStatus("none")
    }
  },[mutationStatus,setMutationStatus,toast])

  if(!permissions.includes("WRITE_APPS") && !permissions.includes("MASTER")) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon"><Plus/></Button>
      </DialogTrigger>
        <DialogContent>
          {res != "success" ? <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle application</DialogTitle>
            </DialogHeader>
            <DialogDescription>Remplissez le formulaire ci-dessous pour ajouter une nouvelle application</DialogDescription>
            <div className="space-y-2">
              <div className="flex gap-2 items-center">
                <Input name="logo" type="text" placeholder="URL du logo ~ " value={logo} onChange={e => setLogo(e.target.value)}/>
                <img src={logo ? logo : defaultLogo} alt="logo" className="w-12 h-12"/>
              </div>
              <Input name="name" type="text" placeholder="Nom de l'application" required/>
              <Input name="login" type="text" placeholder="Nom d'utilisateur / E-mail / Téléphone..." required/>
              <div className="flex gap-2">
                <Input name="address" type="text" placeholder="Adresse" required/>
                <Select name="type" required={true}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Type d'adresse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="URL">URL</SelectItem>
                    <SelectItem value="IP">IP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Input name="password" type={displayPassword ? "text" : "password"} placeholder="Mot de passe" required/>
                <Button type="button" variant="outline" onClick={() => setDisplayPassword(!displayPassword)} size="icon">{displayPassword ? <Eye/> : <EyeOff/>}</Button>
              </div>
            </div>
            <DialogFooter className="pt-2">
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button type="submit" disabled={mutationStatus == "loading"}>Ajouter l&apos;application</Button>
            </DialogFooter>
          </form>:
          <div>
            <DialogHeader>
              <DialogTitle>Application ajoutée avec succès !</DialogTitle>
            </DialogHeader>
            <DialogFooter className="pt-2">
              <DialogClose asChild>
                <Button variant="outline" onClick={() => setResponse("none")}>Fermer</Button>
              </DialogClose>
              <Button onClick={() => setResponse("none")}>Ajouter une autre</Button>
            </DialogFooter>
          </div>
          }
      </DialogContent>
    </Dialog>
  );
}

export default AddApp
