"use client"
import Link from "next/link";
import { AdminProvider } from "@/components/providers/admin-provider";
const AdminLayout = ({children}) => {
  return (
    <AdminProvider>
      {children}
    </AdminProvider>
  );
}

export default AdminLayout;
