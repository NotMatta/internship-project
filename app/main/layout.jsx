"use client"
import { useSession } from "@/components/providers/session-provider";
import { redirect } from "next/navigation";
import { ApplicationsProvider } from "@/components/providers/applications-provider";
import { useToast } from "@/hooks/use-toast";

const MainLayout = ({ children }) => {

  const {session} = useSession()
  const {toast} = useToast()
  if(session.status == "unauthenticated") redirect("/auth/login")
  if(!session.user.permissions.includes("READ_APPS") && !session.user.permissions.includes("MASTER")){
    toast({title:"Unauthorized",description:"You do not have permission to view this page."})
    redirect("/profile")
  }
  if (session.status === "loading") return <div>Loading...</div>
  return (
    <ApplicationsProvider>
      {children}
    </ApplicationsProvider>
  );
}

export default MainLayout
