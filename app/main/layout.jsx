"use client"
import Navbar from "@/components/navbar-component";
import { useSession } from "@/components/providers/session-provider";
import { redirect } from "next/navigation";

const MainLayout = ({ children }) => {

  const {session} = useSession()
  if(session.status == "unauthenticated") redirect("/auth/login")
  if (session.status === "loading") return <div>Loading...</div>
  console.log(session)
  return (
    <div className="flex w-full h-full">
      <Navbar/>
      <div className="w-full h-full p-4">
        {session.token}
        {children}
      </div>
    </div>
  );
}

export default MainLayout
