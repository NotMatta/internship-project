"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSession } from "@/components/providers/session-provider"

const RegisterForm = () => {
  const {signUp} = useSession()
  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const ok = await signUp(formData)
    if(ok){
      e.target.reset()
    }
  }
  return (
    <form className="flex flex-col w-full max-w-[400px] gap-2" onSubmit={handleSubmit}>
      <h2>Creating a new account</h2>
      <Input type="text" placeholder="Name..." name="name" required/>
      <Input type="email" placeholder="Email..." name="email" requried/>
      <Input type="password" placeholder="Password..." name="password" required/>
      <Input type="password" placeholder="Confirm Password..." name="cpassword" required/>
      <Button type="submit">Create</Button>
    </form>
  )
}

export default RegisterForm
