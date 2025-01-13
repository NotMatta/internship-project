"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSession } from "@/components/session-manager"
import Link from "next/link"

const RegisterForm = () => {
  const {signUp} = useSession()
  return (
    <form className="flex flex-col w-full max-w-[400px] text-center p-4 border rounded-xl gap-2" action={signUp}>
      <h2>Create an account</h2>
      <Input type="text" placeholder="Name..." name="name"/>
      <Input type="email" placeholder="Email..." name="email"/>
      <Input type="password" placeholder="Password..." name="password"/>
      <Input type="password" placeholder="Confirm Password..." name="cpassword"/>
      <Button type="submit">Sign up</Button>
      <Link href="/auth/login">Already have an account?</Link>
    </form>
  )
}

export default RegisterForm
