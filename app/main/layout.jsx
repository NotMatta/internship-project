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
    toast({title:"Non autorisé",description:"Vous n'avez pas la permission de voir cette page."});
    redirect("/profile")
  }
  if (session.status === "loading") return <div>Loading...</div>
  return (
    <ApplicationsProvider>
      <div className="flex flex-col max-h-full h-full overflow-y-scroll">
        {children}
      </div>
    </ApplicationsProvider>
  );
}

export default MainLayout
