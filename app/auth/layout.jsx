"use client"
const { useSession } = require("@/components/providers/session-provider");
const { redirect } = require("next/navigation");

const AuthLayout = ({children}) => {
  const {session} = useSession()
  if(session.status === "authenticated") redirect("/profile")
  if (session.status === "loading") return <div>Loading...</div>
  return (
    <div className="w-full h-full flex items-center justify-center">
      {children}
    </div>
  );
}

export default AuthLayout
