"use client"
import { useSession } from "@/components/providers/session-provider"
import { useToast } from "@/hooks/use-toast"
import {redirect} from "next/navigation"

const LogsInput = () => {
  return (
    <div>
    </div>
  )
}

const LogsPage = () => {
  const {toast} = useToast()
  const {session} = useSession()
  if(!session.user.permissions.includes("READ_LOGS") && !session.user.permissions.includes("MASTER")){
    toast({title:"Unauthorized",description:"You do not have permission to view this page."})
    redirect("/profile")
  }
  return (
    <div>
      <h1>Logs Page</h1>
    </div>
  )
}
export default LogsPage
