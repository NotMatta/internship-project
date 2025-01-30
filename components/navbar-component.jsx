"use client"
import { AppWindow, FileClock, KeyRound, LayoutDashboard, LogOut, Menu, Shield, Tag, User, UserRound } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "./providers/session-provider"
import Logo from "./logo"
import { usePath } from "./providers/path-provider"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "./ui/button"


const NavLink = ({children,href,permission}) => {
  const [active, setActive] = useState(false)
  const {path,setPath} = usePath()
  const permissions = useSession().session.user?.permissions || []
  useEffect(() => {
    if(path == href.split("/").pop()){
      setActive(true)
      return
    }
    setActive(false)
  }, [href,path])

  if(permission && !permissions.includes(permission) && !permissions.includes("MASTER")) return null

  return(
    <Link onClick={() => setPath(href.split("/").pop())} href={href} className={`text-accent-foreground flex gap-2 px-2 py-3 rounded-xl ${active ? "text-background bg-primary" : "hover:bg-accent hover:text-primary"}`}>{children}</Link>
  )
}

const NavbarContent = ({className}) => {
  const {path, setPath} = usePath()
  const {session, signOut}= useSession()
  const permissions = session.user?.permissions || []

  if(session.status == "unauthenticated" || path == "") return null

  return(
    <div className={className}>
      <Link href="/" onClick={() => setPath("")}>
        <h2 className="flex text-xl lg:text-2xl p-4 gap-2 font-extrabold items-center text-primary w-full justify-center">
          <Logo/> Password Manager
        </h2>
      </Link>
      <nav className="flex flex-col gap-2 lg:p-4">
        <NavLink href="/main/dashboard" permission="READ_APPS"><LayoutDashboard/> Tableau de bord</NavLink>
        <NavLink href="/main/applications" permission="READ_APPS"><AppWindow/>Applications</NavLink>
        <NavLink href="/main/passwords" permission="READ_APPS"><KeyRound/>Mots de passe</NavLink>
        <NavLink href="/profile"><User/>Profil</NavLink>
        {(permissions.includes("READ_USERS") || permissions.includes("READ_LOGS") || permissions.includes("READ_ROLES") || permissions.includes("MASTER")) && <p className="flex gap-2 px-2 py-3"><Shield/>Panneau d'administration</p>}
        <div className="ml-8 space-y-2">
          <NavLink href="/admin/users" permission="READ_USERS"><UserRound />Utilisateurs</NavLink>
          <NavLink href="/admin/roles" permission="READ_ROLES"><Tag />Rôles</NavLink>
          <NavLink href="/admin/logs" permission="READ_LOGS"><FileClock />Journaux</NavLink>
        </div>
        <button className="text-accent-foreground flex gap-2 px-2 py-3 rounded-xl hover:bg-accent hover:text-primary" onClick={signOut}><LogOut/>Se déconnecter</button>
      </nav>
    </div>
  )
}

const NavBarSheet = () => {
  return(
     <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden absolute bottom-2 right-12"><Menu/></Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="overflow-y-scroll">
        <NavbarContent className="space-y-4"/>
      </SheetContent>
    </Sheet>
  )
}

const Navbar = () => {
  return(
    <>
      <NavBarSheet/> 
      <NavbarContent className="hidden lg:block min-w-[300px] border-r h-full "/>
    </>
  )
}

export default Navbar
