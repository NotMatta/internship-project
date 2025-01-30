"use client"
import { useApplications } from "@/components/providers/applications-provider"
import { ClockAlert, Repeat, ShieldCheck, ShieldX } from "lucide-react"
import { calculateOverAllScore, calculatePasswordScore, getAgeInDays } from "@/lib/utils"
import EditApp from "@/components/edit-app-component"
import PopApp from "@/components/ui/pop-app-component"

const DashBoard = () => {
  const applications = useApplications().applications.data || [];
  const passwords = applications.map(app => app.password)
  const outdatedPasswords = applications.filter(app => getAgeInDays(app.updatedAt) > 30)
  const weakPasswords = applications.filter(app =>  calculatePasswordScore(app.password) <= 60)
  const repetetivePasswords = applications.filter(app => passwords.filter(p => p == app.password).length > 1)
  const score = calculateOverAllScore(passwords).toFixed(2)
  const color = score <= 60 ? "red" : score <= 80 ? "yellow" : "green"
  return(
    <div className="flex flex-col gap-4 max-w-full">
      <h1 className="mb-5">Tableau de bord</h1>
      <h2>Score global du mot de passe :</h2>
      <div className={`flex flex-col md:flex-row justify-center items-center text-${color}-500`}>
        <p className="text-9xl font-extrabold">{score}%</p>
        <ShieldCheck size={256}/>
      </div>
      <h2>Statistiques :</h2>
      <div className="flex flex-col xl:flex-row md:justify-around items-center gap-2 lg:gap-0">
        <div className={`flex flex-col items-center relative text-${outdatedPasswords.length == 0 ? "green" : "red"}-500`}>
          <p className="font-extrabold text-xl absolute rounded-full p-4 top-1 right-1 w-6 h-6 bg-accent border flex items-center justify-center">
            {outdatedPasswords.length}
          </p>
          <ClockAlert size={256}/>
          <h3>Mots de passe obsolètes</h3>
        </div>
        <div className={`flex flex-col items-center relative text-${weakPasswords.length == 0 ? "green" : "red"}-500`}>
          <p className="font-extrabold text-xl absolute rounded-full p-4 -top-1 -right-1 w-6 h-6 bg-accent border flex items-center justify-center">
            {weakPasswords.length}
          </p>
          <ShieldX size={256}/>
          <h3>Mots de passe faibles</h3>
        </div>
        <div className={`flex flex-col items-center relative text-${repetetivePasswords.length == 0 ? "green" : "red"}-500`}>
          <p className="font-extrabold text-xl absolute rounded-full p-4 -top-1 -right-1 w-6 h-6 bg-accent border flex items-center justify-center">
            {repetetivePasswords.length}
          </p>
          <Repeat size={256}/>
          <h3>Mots de passe répétitifs</h3>
        </div>
      </div>
      <h2>Statistiques détaillées :</h2>
      <div className="w-full grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-6 gap-2">
        {weakPasswords.length > 0 && weakPasswords.map(app => (
          <div key={app.id} className="rounded-3xl p-4 border">
            <div className="flex text-bold text-xl gap-2 items-center">
              <img src={app.logo} alt={app.name} className="w-10 h-10 object-cover rounded-xl"/>
              <p className="line-clamp-1">{app.name}</p>
            </div>
            <p className="text-red-500">Score de faiblesse : {calculatePasswordScore(app.password)}%</p>
            <div className="space-x-2">
              <PopApp application={app}/>
              <EditApp application={app}/>
            </div>
          </div>
        ))}
        {outdatedPasswords.length > 0 && outdatedPasswords.map(app => (
          <div key={app.id} className="rounded-3xl p-4 border">
            <div className="flex text-bold text-xl gap-2 items-center">
              <img src={app.logo} alt={app.name} className="w-10 h-10 object-cover rounded-xl"/>
              <p className="line-clamp-1">{app.name}</p>
            </div>
            <p className="text-red-500">Obsolète : {getAgeInDays(app.updatedAt)} jours</p>
            <div className="space-x-2">
              <PopApp application={app}/>
              <EditApp application={app}/>
            </div>
          </div>
        ))}
        {repetetivePasswords.length > 0 && repetetivePasswords.map(app => (
          <div key={app.id} className="rounded-3xl p-4 border">
            <div className="flex text-bold text-xl gap-2 items-center">
              <img src={app.logo} alt={app.name} className="w-10 h-10 object-cover rounded-xl"/>
              <p className="line-clamp-1">{app.name}</p>
            </div>
            <p className="text-red-500">Répétitif : {passwords.filter(p => p == app.password).length} fois</p>
            <div className="space-x-2">
              <PopApp application={app}/>
              <EditApp application={app}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DashBoard
