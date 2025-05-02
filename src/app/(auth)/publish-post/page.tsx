import { Suspense } from "react";
import PublishPost from "./publishPost.client";
import AnimatedSpinner from "@/components/AnimatedSpinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Server Component
export default function Page() {
  return (
    <Card className="w-full ">
      <CardHeader className="w-full pr-20">
        <CardTitle>Publish Post</CardTitle>
        <CardDescription>
          Publish your Post to Instagram, Trustie and more...
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
          <PublishPost />
        </Suspense>
      </CardContent>
    </Card>
  );
}
