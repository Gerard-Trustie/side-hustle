import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/ModeToggle";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AdminName } from "@/components/AdminName";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex min-h-screen w-full">
        <main className="flex-1 w-full">
          <div className="flex flex-col px-4 mt-2 flex-1 w-full  pr-[130px]">
            {children}
          </div>
          <div className="fixed top-2 right-2">
            <Card>
              <CardHeader className="flex items-center justify-center">
                <AdminName />
                <SidebarTrigger />
                <ModeToggle />
              </CardHeader>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
