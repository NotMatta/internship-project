"use client"
import { useSession } from "@/components/providers/session-provider"
import { useApplications } from "@/components/providers/applications-provider"
import { ShieldCheck } from "lucide-react"
import { calculateOverAllScore, calculatePasswordScore, getAgeInDays } from "@/lib/utils"

const DashBoard = () => {
  const {session} = useSession()
  const applications = useApplications().applications.data || [];
  const passwords = applications.map(app => app.password)
  const outdatedPasswords = applications.filter(app => getAgeInDays(app.updatedAt) > 30)
  const weakPasswords = applications.filter(app =>  calculatePasswordScore(app.password) <= 60)
  const repetetivePasswords = applications.filter(app => passwords.filter(p => p == app.password).length > 1)
  const score = calculateOverAllScore(passwords)
  return(
    <div className="grid grid-cols-3 grid-rows-3 w-full h-full gap-2 [&_div]:bg-secondary">
      <div className="border rounded-xl col-span-3 row-span-2 p-4 flex flex-col h-full">
        <h1>Dashboard</h1>
        <p>Welcom to your dashboard {session.user.name}</p>
        <p>You have <strong>{applications.length}</strong> applications in this account</p>
        <div className={`flex w-full justify-center items-center h-full ${score <= 20 ? "text-red-500" : score <= 40 ? "text-red-500" : score <= 60 ? "text-yellow-500" : score <= 80 ? "text-yellow-500" : score <= 90 ? "text-green-500" : "text-green-500"}`}>
          <ShieldCheck size="256" />
          <p className="font-bold text-7xl">{score}%</p>
        </div>
      </div>
      <div className="border rounded-xl p-2">
        <h3>Outdated Passwords</h3>
        {outdatedPasswords.length > 0 ? 
          <p className="text-yellow-600">You have {outdatedPasswords.length} outdated passwords for example `{outdatedPasswords[0].name}`</p> :
          <p className="text-green-500">You have no outdated passwords</p>
        }
      </div>
      <div className="border rounded-xl p-2">
        <h3>Weak Passwords</h3>
        {weakPasswords.length > 0 ?
          <p className="text-yellow-600">You have {weakPasswords.length} weak passwords such as `{weakPasswords[0].name}`</p> :
          <p className="text-green-500">You have no weak passwords</p>
        }
      </div>
      <div className="border rounded-xl p-2">
        <h3>Repetetive Passwords</h3>
        {repetetivePasswords.length > 0 ?
          <p className="text-red-600">You have {repetetivePasswords.length} repetetive passwords like `{repetetivePasswords[0].name}`</p> :
          <p className="text-green-500">You have no repetetive passwords</p>
        }
      </div>    
    </div>
  )
}

export default DashBoard
