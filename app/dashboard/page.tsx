import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/");
  }
  //password: Blue-Elephant-99-Sky!
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}
