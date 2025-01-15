"use client"
import AddAccount from "@/components/add-account-component";
import { useCredentials } from "@/components/providers/credentials-provider";
import { useEffect } from "react";

const AccountsPage = () => {

  const credentials = useCredentials().credentials.data;
  useEffect(() => {
    console.log("Credentials loaded",credentials);
  }, [credentials])

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <h1>Accounts</h1>
        <AddAccount/>
      </div>
      <div className="w-full grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-2">
        {credentials && credentials.map((credential) => (
          <div key={credential.id} className="p-4 border rounded-xl">
            <h2>{credential.name}</h2>
            <p>{credential.email}</p>
            <p>{credential.password}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AccountsPage
