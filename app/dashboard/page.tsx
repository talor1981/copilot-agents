import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardContent } from "./DashboardContent";

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardContent />
    </div>
  );
}
