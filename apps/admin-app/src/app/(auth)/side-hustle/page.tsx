import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResourceManager } from "./resource-manager";
import AnimatedSpinner from "@/components/AnimatedSpinner";

export default function KnowledgePage() {
  return (
    <Card className="flex flex-col w-full min-h-screen">
      <CardHeader className="w-full pr-20 pb-8">
        <CardTitle>Side Hustle</CardTitle>
        <CardDescription>
          Find and manage your side hustle 
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-24">
              <AnimatedSpinner size={60} isCircle={false} />
            </div>
          }
        >
          <ResourceManager />
        </Suspense>
      </CardContent>
    </Card>
  );
}
