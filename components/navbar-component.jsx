"use client"
import { AppWindow, FileClock, KeyRound, LayoutDashboard, Lock, Shield, Tag, User, UserRound } from "lucide-react"
import { useEffect, useState, useContext, createContext } from "react"
import Link from "next/link"
import { useSession } from "./providers/session-provider"
import Logo from "./logo"
import { usePath } from "./providers/path-provider"


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

const Navbar = () => {
  const {path, setPath} = usePath()
  const {session}= useSession()
  const permissions = session.user?.permissions || []

  if(session.status == "unauthenticated" || path == "") return null

  return(
    <div className="min-w-[300px] border-r h-full">
      <Link href="/" onClick={() => setPath("")}><h2 className="flex text-2xl p-4 gap-2 font-extrabold items-center text-primary"><Logo/> OTC Password Manager</h2></Link>
      <nav className="flex flex-col gap-2 p-4">
        <NavLink href="/main/dashboard" permission="READ_APPS"><LayoutDashboard/> Dashboard</NavLink>
        <NavLink href="/main/applications" permission="READ_APPS"><AppWindow/>Applications</NavLink>
        <NavLink href="/main/passwords" permission="READ_APPS"><KeyRound/>Passwords</NavLink>
        <NavLink href="/profile"><User/>Profile</NavLink>
        {(permissions.includes("READ_USERS") || permissions.includes("READ_LOGS") || permissions.includes("READ_ROLES") || permissions.includes("MASTER")) && <p className="flex gap-2 px-2 py-3"><Shield/>Admin Panel</p>}
        <div className="ml-8 space-y-2">
          <NavLink href="/admin/users" permission="READ_USERS"><UserRound />Users</NavLink>
          <NavLink href="/admin/roles" permission="READ_ROLES"><Tag />Roles</NavLink>
          <NavLink href="/admin/logs" permission="READ_LOGS"><FileClock />Logs</NavLink>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
