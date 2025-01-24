"use client"
import { usePath } from "@/components/providers/path-provider";
import { useEffect } from "react";
import { useSession } from "@/components/providers/session-provider";

const ProfilePage = () => {
  const {session, signOut } = useSession();
  const {setPath} = usePath()
  useEffect(() => {
    setPath("profile")
  }, [setPath])
  if(session.status == "unauthenticated") redirect("/auth/login")
  if (session.status === "loading") return <div>Loading...</div>
  return( 
    <div>
      Profile Page
      <button onClick={() => signOut()}>Signout</button>
    </div>
  )
}

export default ProfilePage;
