"use client"
import EditApp from "@/components/edit-app-component";
import DeleteApp from "@/components/delete-app.component";
import { useState, useEffect } from "react";
import { useCredentials } from "@/components/providers/credentials-provider";
import {calculatePasswordScore as score, calculatePasswordStrength as strength, getAgeInDays as age} from "@/lib/utils";

const PasswordRow = ({credential,passwords}) => {
  const passwordAge = age(credential.updatedAt);
  const passwordStrength = strength(credential.password,passwordAge,passwords);
  const passwordScore = score(credential.password);
  return (
    <tr className="[&>td]:p-2 border">
      <td>{credential.name}<br/>{credential.username}</td>
      <td>
        {passwordScore}%
        <div className="bg-accent h-3 w-full rounded-xl">
          <div className={`h-full rounded-xl ${passwordScore <= 20 ? "bg-red-500 w-1/5" : passwordScore <= 40 ? "bg-red-500 w-2/5" : passwordScore <= 60 ? "bg-yellow-500 w-3/5" : passwordScore <= 80 ? "bg-yellow-500 w-4/5" : passwordScore <= 90 ? "bg-green-500 w-11/12" : "w-full"}`}></div>
        </div>
      </td>
      <td>{passwordAge} days</td>
      <td>{passwordStrength}</td>
      <td>
        <div className="flex justify-end gap-2">
          <EditApp application={credential}/>
          <DeleteApp application={credential}/>
        </div>
    </td>
    </tr>
  )
}

const PasswordsPage = () => {

  const credentials = useCredentials().credentials.data;
  const [passwords, setPasswords] = useState([]);
  useEffect(() => {
    setPasswords(credentials);
  }, [credentials])

  return (
    <div className="max-h-full overflow-scroll">
      <h1>Passwords</h1>
      <table className="w-full border">
        <thead>
          <tr className="[&>th]:p-2 border [&>th]:text-start">
            <th>Name</th>
            <th>Password Strength</th>
            <th>Password Age</th>
            <th>Safety Level</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {credentials && credentials.map((credential) => (
            <>
            <PasswordRow key={credential.id} credential={credential} passwords={passwords}/>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PasswordsPage
