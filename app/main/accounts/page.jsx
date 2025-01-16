"use client"
import AddAccount from "@/components/add-account-component";
import DeleteAccount from "@/components/delete-account.component";
import EditAccount from "@/components/edit-account-component";
import { useCredentials } from "@/components/providers/credentials-provider";
import { useEffect } from "react";

const AccountsPage = () => {

  const credentials = useCredentials().credentials.data;
  useEffect(() => {
    console.log("Credentials loaded",credentials);
  }, [credentials])

  return (
    <div className="gap-2 flex flex-col h-full max-h-full">
      <div className="flex justify-between">
        <h1>Accounts</h1>
        <AddAccount/>
      </div>
      <div className="w-full overflow-scroll grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-2">
        {credentials && credentials.map((credential) => (
          <div key={credential.id} className="p-4 border rounded-xl flex flex-col justify-between aspect-square">
            <h2 className="line-clamp-1">{credential.name}</h2>
            <div className="flex-grow">{credential.email}<br/>{credential.password}</div>
            <div className="flex gap-2 justify-end">
              <EditAccount account={credential}/>
              <DeleteAccount account={credential}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AccountsPage
