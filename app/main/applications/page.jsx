"use client"
import AddApp from "@/components/add-app-component";
import EditApp from "@/components/edit-app-component";
import DeleteApp from "@/components/delete-app.component";
import PopApp from "@/components/ui/pop-app-component";
import { useApplications } from "@/components/providers/applications-provider";

const AppsPage = () => {

  const applications = useApplications().applications.data;

  return (
    <div className="gap-9 flex flex-col h-full max-h-full">
      <div className="flex justify-between">
        <h1>Applications</h1>
        <AddApp/>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
        {applications && applications.map((application) => (
          <div key={application.id} className="p-4 border rounded-xl flex flex-col gap-4 justify-between w-full bg-accent">
            <div className="flex gap-2 items-center border-b border-foreground h-16">
              <img src={application.logo} className="h-12 w-12"/>
              <h3 className="line-clamp-2 text-xl">{application.name}</h3>
            </div>
            <div className="flex gap-2 justify-end">
              <PopApp application={application}/>
              <EditApp application={application}/>
              <DeleteApp application={application}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AppsPage
