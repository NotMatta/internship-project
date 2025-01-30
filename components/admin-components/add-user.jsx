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
    }
    if(mutationStatus == "u_invalid"){
      setResponse("invalid")
      setMutationStatus("none")
    }
  },[mutationStatus,setMutationStatus])

  if((!permissions.includes("WRITE_USERS") || !permissions.includes("READ_ROLES") || !roles)  && !permissions.includes("MASTER")) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon"><Plus/></Button>
      </DialogTrigger>
      <DialogContent>
        {res != "success" ? <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
          </DialogHeader>
          <DialogDescription>Remplissez le formulaire ci-dessous pour ajouter un nouvel utilisateur</DialogDescription>
          {res == "invalid" && <DialogDescription className="text-red-500">*Assurez-vous de fournir des entrées valides</DialogDescription>}
          <div className="space-y-2 mt-2">
            <Input name="name" type="text" placeholder="Nom" required/>
            <Input name="email" type="email" placeholder="E-mail" required/>
            <div className="flex gap-2">
              <Input name="password" type={displayPassword ? "text" : "password"} placeholder="Mot de passe" required/>
              <Button type="button" variant="outline" onClick={() => setDisplayPassword(!displayPassword)} size="icon">{displayPassword ? <Eye/> : <EyeOff/>}</Button>
            </div>
            <Select name="roleId" required={true}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline" type="reset">Annuler</Button>
            </DialogClose>
            <Button type="submit" disabled={mutationStatus == "loading"}>Ajouter un utilisateur</Button>
          </DialogFooter>
        </form>:
        <div>
          <DialogHeader>
            <DialogTitle>Utilisateur ajouté avec succès !</DialogTitle>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setResponse("none")}>Fermer</Button>
            </DialogClose>
            <Button onClick={() => setResponse("none")}>Ajouter un autre</Button>
          </DialogFooter>
        </div>
        }
      </DialogContent>
    </Dialog>
  );
}

export default AddUser
