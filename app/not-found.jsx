import { redirect } from "next/navigation";

const NotFound = () => {
  redirect("/profile")
}

export default NotFound;
