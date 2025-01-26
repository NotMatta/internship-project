"use client"
import { useSession } from "@/components/providers/session-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { DatePickerWithRange as DatePicker } from "@/components/date-range-picker"
import { useState } from "react"
import { addDays } from "date-fns"
import {redirect} from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

const actions = ["any","LOGIN","LOGOUT","CREATE_USER","DELETE_USER","UPDATE_USER","CREATE_APP","DELETE_APP","UPDATE_APP","CREATE_ROLE","DELETE_ROLE","UPDATE_ROLE"]

const LogsInput = ({setLogs}) => {

  const {session} = useSession()
  const {toast} = useToast()

  const [date, setDate] = useState({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const body = {search:formData.get("search"),type:formData.get("type") || "any",from:date.from.toISOString(),to:date.to.toISOString()}
    console.log(body)
    const res = fetch(`/api/logs?search=${body.search}&type=${body.type}&from=${body.from}&to=${body.to}`,{
        method: "GET",
        headers: {
          "Authorization": `Bearer ${session.token}`,
        }
      })
    if(res.ok){
      const data = res.json()
      setLogs(data.logs)
      return
    }
    toast({title:"Error",description:"Failed to fetch logs."})
  }

  return (
    <form className="flex gap-1" onSubmit={handleSubmit}>
      <Input name="search" placeholder="Search Logs" />
      <Select name="type">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Action type" />
        </SelectTrigger>
        <SelectContent>
          {actions.map((action) => (
            <SelectItem key={action} value={action}>
              {action.split("_").join(" ").toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>             
      <DatePicker date={date} setDate={setDate} />
      <Button>Search</Button>
    </form>
  )
}

const LogsPage = () => {
  const [logs, setLogs] = useState([])
  const [page, setPage] = useState(1)
  const {toast} = useToast()
  const {session} = useSession()
  if(!session.user.permissions.includes("READ_LOGS") && !session.user.permissions.includes("MASTER")){
    toast({title:"Unauthorized",description:"You do not have permission to view this page."})
    redirect("/profile")
  }
  return (
    <div className="w-full flex flex-col gap-9">
      <h1>Logs Page</h1>
      <LogsInput setLogs={setLogs}/>
      {logs.length > 10 && <div className="flex w-full justify-end items-center gap-2 text-accent-foreground">
        <Button size="icon" onClick={() => setPage(page-1)} disabled={page == 1}><ChevronLeft/></Button>
        <p className="bg-accent rounded-xl w-8 h-10 flex items-center justify-center">{page}</p>
        <Button size="icon" onClick={() => setPage(page+1)} disabled={logs.length < 10}><ChevronRight/></Button>
      </div>}
      <div className="flex flex-col gap-3">
        {logs.map(log => (
          <div key={log.id} className="flex flex-col gap-1">
            <p>{log.date}</p>
            <p>{log.message}</p>
            <p>{log.action}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
export default LogsPage
