"use client"
import { useEffect, useState } from "react";
import { useSession } from "@/components/providers/session-provider";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import RegisterForm from "@/components/register-form";

const AdminPage = () => {

  const [verified, setVerified] = useState(false);
  const { session } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const validateAdmin = async () => {
      const res = await fetch("/api/auth/validate", {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });
      if (!res.ok) {
        toast({ title: "Unauthorized", description: "You are not authorized to view this page" });
        router.push("/main/dashboard");
        return
      }
      const data = await res.json();
      if (data.user.role.name !== "ADMIN") {
        toast({ title: "Unauthorized", description: "You are not authorized to view this page" });
        router.push("/main/dashboard");
        return
      }
      setVerified(true);
    }
    if(verified) return
    validateAdmin();
  },[session.token,toast,verified,router])
  
  if (!verified) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-2">
      <h1>Admin Page</h1>
      <RegisterForm/>
    </div>
  );
}

export default AdminPage;
