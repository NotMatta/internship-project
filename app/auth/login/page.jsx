"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSession } from "@/components/providers/session-provider"

const LoginForm = () => {
  const {logIn} = useSession()
  return (
    <form className="flex flex-col w-full max-w-[400px] text-center p-4 border rounded-xl gap-2" action={logIn}>
      <h2>Login</h2>
      <Input type="email" placeholder="Email..." name="email" required/>
      <Input type="password" placeholder="Password..." name="password" required/>
      <Button type="submit">Login</Button>
    </form>
  )
}

export default LoginForm
