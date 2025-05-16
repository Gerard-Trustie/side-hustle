import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Suspense } from "react";
import AnimatedSpinner from "@components/AnimatedSpinner";
import Dashboard from "./Dashboard";

// This is a Server Component by default in Next.js App Router
export default async function HomePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trustie Dashboard</CardTitle>
        <CardDescription>
          Welcome to your Dashboard where you can see users, usage,
          transactions...
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-24">
              <AnimatedSpinner size={60} isCircle={false} />
            </div>
          }
        >
          <Dashboard />
        </Suspense>
      </CardContent>
    </Card>
  );
}
