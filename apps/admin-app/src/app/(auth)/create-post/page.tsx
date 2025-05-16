import { Suspense } from "react";
import CreatePost from "./createPost.client";
import AnimatedSpinner from "@components/AnimatedSpinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";

// Server Component
export default function Page() {
  return (
    <Card>
      <CardHeader className="w-full pr-20">
        <CardTitle>Create New Post</CardTitle>
        <CardDescription>
          Create a new Post from one of the Trustie Mentor...
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
          <CreatePost />
        </Suspense>
      </CardContent>
    </Card>
  );
}
