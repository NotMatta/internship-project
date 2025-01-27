"use client"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Eye, EyeClosed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "./input"
import { useState } from "react"
const PopApp = ({application}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <img src={application.logo} className="h-12 w-12"/>
            {application.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p><strong>Application Name:</strong> {application.name}</p>
          <p><strong>Address:</strong> {application.address}</p>
          <p><strong>Type:</strong> {application.type}</p>
          <p><strong>Login:</strong> {application.login}</p>
          <div className="flex gap-1 items-center">
            <strong>Password:</strong>
            <Input type={!showPassword ? "password" : "text"} value={application.password}/>
            <Button onClick={() => setShowPassword(!showPassword)} className="flex-shrink-0" variant="outline" size="icon">
              {showPassword ? <Eye/> : <EyeClosed/>}
            </Button>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={() => setShowPassword(false)}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PopApp
