"use client"

import Logo from "@/components/logo";

const { useSession } = require("@/components/providers/session-provider");
const { redirect } = require("next/navigation");

const AuthLayout = ({children}) => {
  const {session} = useSession()
  if(session.status === "authenticated") redirect("/profile")
  if (session.status === "loading") return <div>Loading...</div>
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <h2 className="flex text-xl lg:text-2xl gap-2 font-extrabold items-center text-primary border-none justify-center absolute top-2 left-2">
        <Logo/> Password Manager
      </h2>
      {children}
    </div>
  );
}

export default AuthLayout
