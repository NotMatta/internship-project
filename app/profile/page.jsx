"use client"
import { usePath } from "@/components/providers/path-provider";
import { useEffect } from "react";
import { useSession } from "@/components/providers/session-provider";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ProfilePage = () => {
  const {session, editPassword } = useSession();
  const {setPath} = usePath()
  useEffect(() => {
    setPath("profile")
  }, [setPath])
  if(session.status == "unauthenticated") redirect("/auth/login")
  if (session.status === "loading") return <div>Loading...</div>
  return( 
    <div className="flex flex-col gap-2">
      <h1 className="mb-7">Profile</h1>
      <div className="flex gap-3">
        <img
          src={session.user.avatar || "https://i.pinimg.com/736x/3f/92/28/3f92282a1709cc7b26b9d04409241d36.jpg"}
          alt="avatar" className="rounded-full w-32 h-32"/>
        <div className="flex flex-col justify-center">
          <h2>{session.user.name}</h2>
          <p>email: {session.user.email}</p>
        </div>
      </div>
      <h2>Permissions:</h2>
      <div className="flex gap-2 flex-wrap [&_p]:text-sm items-center">
        {session.user.permissions.map((permission) => <p key={permission} className="text-accent-foreground bg-accent py-1 px-2 rounded-xl">{permission}</p>)}
      </div>
      <h2>Change Password</h2>
      <form className="space-y-2" action={editPassword}>
        <Input name="password" type="password" placeholder="Old Password"/>
        <Input name="newPassword" type="password" placeholder="New Password"/>
        <Input name="confirmPassword" type="password" placeholder="Confirm Password"/>
        <Button type="reset" variant="outline" className="mr-2">Cancel</Button>
        <Button type="submit">Save</Button>
      </form>
    </div>
  )
}

export default ProfilePage;
