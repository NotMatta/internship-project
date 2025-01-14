"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSession } from "@/components/providers/session-provider"
import Link from "next/link"

const RegisterForm = () => {
  const {signUp} = useSession()
  return (
    <form className="flex flex-col w-full max-w-[400px] text-center p-4 border rounded-xl gap-2" action={signUp}>
      <h2>Create an account</h2>
      <Input type="text" placeholder="Name..." name="name" required/>
      <Input type="email" placeholder="Email..." name="email" requried/>
      <Input type="password" placeholder="Password..." name="password" required/>
      <Input type="password" placeholder="Confirm Password..." name="cpassword" required/>
      <Button type="submit">Sign up</Button>
      <Link href="/auth/login">Already have an account?</Link>
    </form>
  )
}

export default RegisterForm
