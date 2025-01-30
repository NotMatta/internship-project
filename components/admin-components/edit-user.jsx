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
import { Eye, EyeOff, SquarePen } from "lucide-react";
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


const EditUser = ({user}) => {

  const permissions = useSession().session.user.permissions || [];
  const {editUser,roles,mutationStatus,setMutationStatus} = useAdmin()
  const [displayPassword,setDisplayPassword] = useState(false);
  const [res, setResponse] = useState("none");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMutationStatus("loading")
    const formData = new FormData(e.target);
    if(user.name == formData.get("name") && user.email == formData.get("email") && user.roleId == formData.get("roleId" && user.password == formData.get("password"))){
      toast({title:"Invalide",description:"Aucune modification n'a été apportée à l'utilisateur"});
      setResponse("error");
      setMutationStatus("none")
      return
    }
    editUser.mutate(formData)
  }

  useEffect(() => {
    if(mutationStatus == "ue_success"){
      setResponse("success")
      setMutationStatus("none")
    }
    if(mutationStatus == "ue_error"){
      setResponse("error")
      setMutationStatus("none")
    }
    if(mutationStatus == "ue_invalid"){
      setResponse("invalid")
      setMutationStatus("none")
    }
  },[mutationStatus,setMutationStatus])

  if((!permissions.includes("WRITE_USERS") || !permissions.includes("READ_ROLES") || !roles)  && !permissions.includes("MASTER")) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" onClick={() => setResponse("none")}><SquarePen/></Button>
      </DialogTrigger>
      <DialogContent>
        {res != "success" ? <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Modifier un utilisateur</DialogTitle>
          </DialogHeader>
          <DialogDescription>Remplissez le formulaire ci-dessous pour modifier un utilisateur</DialogDescription>
          <div className="space-y-2 mt-2">
            <input type="hidden" name="id" value={user.id}/>
            <Input name="name" type="text" placeholder="Nom" required defaultValue={user.name}/>
            <Input name="email" type="email" placeholder="E-mail" required defaultValue={user.email}/>
            <div className="flex gap-2">
              <Input name="password" type={displayPassword ? "text" : "password"} placeholder="Mot de passe" required defaultValue={user.password}/>
              <Button type="button" variant="outline" onClick={() => setDisplayPassword(!displayPassword)} size="icon">{displayPassword ? <Eye/> : <EyeOff/>}</Button>
            </div>
            <Select name="roleId" defaultValue={user.roleId} required={true}>
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
            <Button type="submit" disabled={mutationStatus == "loading"}>Modifier l&apos;utilisateur</Button>
          </DialogFooter>
        </form>:
        <div>
          <DialogHeader>
            <DialogTitle>Utilisateur modifié avec succès !</DialogTitle>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setResponse("none")}>Fermer</Button>
            </DialogClose>
          </DialogFooter>
        </div>
        }
      </DialogContent>
    </Dialog>
  );
}

export default EditUser
