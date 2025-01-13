"use client"
import { useSession } from "@/components/session-manager";
import { redirect } from "next/navigation";

const MainLayout = ({ children }) => {

  const {session,signOut} = useSession()
  if(session.status == "unauthenticated") redirect("/auth/login")
  if (session.status === "loading") return <div>Loading...</div>
  console.log(session)
  return (
    <div>
      Main page
      welcome {session.user?.name}
      token {session.token}
      <button onClick={() => signOut()}>Signout</button>
      {children}
    </div>
  );
}

export default MainLayout
