"use client"
import { AppWindow, FileClock, KeyRound, LayoutDashboard, Lock, Shield, Tag, User, UserRound } from "lucide-react"
import { useEffect, useState, useContext, createContext } from "react"
import Link from "next/link"
import { useSession } from "./providers/session-provider"
import Logo from "@/public/logo.svg"
import { useTheme } from "next-themes"

const pathContext = createContext("")

const NavLink = ({children,href}) => {
  const [active, setActive] = useState(false)
  const {path,setPath} = useContext(pathContext)
  useEffect(() => {
    if(path == href.split("/").pop()){
      setActive(true)
      return
    }
    setActive(false)
  }, [href,path])
  return(
    <Link onClick={() => setPath(href.split("/").pop())} href={href} className={`text-accent-foreground flex gap-2 px-2 py-3 rounded-xl ${active ? "text-background bg-foreground" : "hover:bg-accent"}`}>{children}</Link>
  )
}

const Navbar = () => {
  const { theme } = useTheme()
  const [path, setPath] = useState("")
  const {session} = useSession()
  useEffect(() => {
    setPath(window.location.pathname.split("/").pop())
  }, [])
  return(
    <div className="min-w-[300px] border-r h-full">
      <h2 className="flex text-xl p-4 gap-2 font-extrabold items-center"><Logo width={40} height={40} fill={theme == "dark" ? "white" : "black"}/> OTC Password Manager</h2>
      <nav className="flex flex-col gap-2 p-4">
        <pathContext.Provider value={{path,setPath}}>
          <NavLink href="/main/dashboard"><LayoutDashboard/> Dashboard</NavLink>
          <NavLink href="/main/applications"><AppWindow/>Applications</NavLink>
          <NavLink href="/main/passwords"><KeyRound/>Passwords</NavLink>
          <NavLink href="/main/profile"><User/>Profile</NavLink>
          {session.user.role == "ADMIN" && <p className="flex gap-2 px-2 py-3"><Shield/>Admin Panel</p>}
          {session.user.role == "ADMIN" && <div className="ml-8 space-y-2">
            <NavLink href="/main/admin/users"><UserRound />Users</NavLink>
            <NavLink href="/main/admin/roles"><Tag />Roles</NavLink>
            <NavLink href="/main/admin/logs"><FileClock />Logs</NavLink>
          </div>}
        </pathContext.Provider>
      </nav>
    </div>
  )
}

export default Navbar
