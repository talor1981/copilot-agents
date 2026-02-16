import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardContent } from "./DashboardContent";
import { Suspense } from "react";

export default async function DashboardPage() {
  const { userId } = await auth();
  //user: test@test1.com
  //password: Andromeda!1234
  if (!userId) {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
