"use client"
const { useSession } = require("@/components/session-manager");
const { redirect } = require("next/navigation");

const AuthLayout = ({children}) => {
  const {session} = useSession()
  if(session.status === "authenticated") redirect("/main/dashboard")
  if (session.status === "loading") return <div>Loading...</div>
  return (
    <div className="w-full h-full flex items-center justify-center">
      {children}
    </div>
  );
}

export default AuthLayout
