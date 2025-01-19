"use client"
import AddApp from "@/components/add-app-component";
import EditApp from "@/components/edit-app-component";
import DeleteApp from "@/components/delete-app.component";
import { useCredentials } from "@/components/providers/credentials-provider";
import { getAgeInDays as age, formatISODate as date } from "@/lib/utils";
import { useEffect } from "react";

const AppsPage = () => {

  const credentials = useCredentials().credentials.data;
  useEffect(() => {
    console.log("Credentials loaded",credentials);
  }, [credentials])

  return (
    <div className="gap-2 flex flex-col h-full max-h-full">
      <div className="flex justify-between">
        <h1>Applications</h1>
        <AddApp/>
      </div>
      <div className="w-full overflow-scroll grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-2">
        {credentials && credentials.map((credential) => (
          <div key={credential.id} className="p-4 border rounded-xl flex flex-col justify-between aspect-square">
            <h2 className="line-clamp-1 text-2xl">{credential.name}</h2>
            <div className="flex-grow">
              <h4>{credential.username}</h4>
              <p>Created at {date(credential.createdAt)}<br/>
              Last Updated {age(credential.updatedAt)} days ago</p>
            </div>
            <div className="flex gap-2 justify-end">
              <EditApp application={credential}/>
              <DeleteApp application={credential}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AppsPage
