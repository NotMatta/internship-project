"use client"
import { usePath } from "@/components/providers/path-provider";
import { useEffect } from "react";
import { useSession } from "@/components/providers/session-provider";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  const {session, signOut } = useSession();
  const {setPath} = usePath()
  useEffect(() => {
    setPath("profile")
  }, [setPath])
  if(session.status == "unauthenticated") redirect("/auth/login")
  if (session.status === "loading") return <div>Loading...</div>
  return( 
    <div className="flex flex-col items-center gap-4">
      <h1>Profile</h1>
      <img
        src={session.user.avatar || "https://i.pinimg.com/736x/3f/92/28/3f92282a1709cc7b26b9d04409241d36.jpg"}
        alt="avatar" className="rounded-full w-32 h-32"/>
      <h2>{session.user.name}</h2>
      <p>email: {session.user.email}</p>
      <Button onClick={() => signOut()}>Signout</Button>
    </div>
  )
}

export default ProfilePage;
