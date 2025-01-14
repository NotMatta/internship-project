"use client"
import { useSession } from "@/components/providers/session-provider";

const ProfilePage = () => {
  const { signOut } = useSession();
  return( 
    <div>
      Profile Page
      <button onClick={() => signOut()}>Signout</button>
    </div>
  )
}

export default ProfilePage;
