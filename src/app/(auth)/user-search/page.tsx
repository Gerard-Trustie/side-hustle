import { Suspense } from "react";
import UserSearch from "./userSearch.client";
import { UserInfo } from "./userInfo.client";
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
  // console.log("🚀 ~ searchParams:", searchParams);

  return (
    <Card className="w-full ">
      <CardHeader className="w-full pr-20">
        <CardTitle>User Search</CardTitle>
        <CardDescription>
          Search a user either by first or last name phone number or email
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
          <UserSearch />
          <UserInfo />
        </Suspense>
      </CardContent>
    </Card>
  );
}
