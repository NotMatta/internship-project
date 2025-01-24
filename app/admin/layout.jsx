"use client"
import { AdminProvider } from "@/components/providers/admin-provider";
import { useSession } from "@/components/providers/session-provider";
import { redirect } from "next/navigation";
const AdminLayout = ({children}) => {
  const {session} = useSession()
  if(session.status == "unauthenticated") redirect("/auth/login")
  if (session.status === "loading") return <div>Loading...</div>
  return (
    <AdminProvider>
      {children}
    </AdminProvider>
  );
}

export default AdminLayout;
