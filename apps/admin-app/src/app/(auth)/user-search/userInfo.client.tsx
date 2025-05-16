"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { LazyTabContent } from "./userTabContent.client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/ui/tabs";

export const UserInfo = () => {
  const searchParams = useSearchParams();
  const selectedUserId = searchParams.get("userId");
  const [focusedTab, setFocusedTab] = useState<string>("Basic");

  useEffect(() => {
    if (selectedUserId) {
      setFocusedTab("Basic");
    }
  }, [selectedUserId]);

  if (!selectedUserId) return null;

  return (
    <Tabs defaultValue="Basic" value={focusedTab} onValueChange={setFocusedTab}>
      <TabsList className="w-full justify-start py-2 ">
        <TabsTrigger className="py-2 px-6  " value="Basic">
          Basic
        </TabsTrigger>
        <TabsTrigger className="py-2 px-6 " value="Details">
          Details
        </TabsTrigger>
        <TabsTrigger className="py-2 px-6 " value="Settings">
          Settings
        </TabsTrigger>
      </TabsList>

      <TabsContent value="Basic">
        <LazyTabContent
          key={`${selectedUserId}-Basic`}
          queryType="getUserBasicProfile"
          userId={selectedUserId}
          isFocused={focusedTab === "Basic"}
        />
      </TabsContent>

      <TabsContent value="Details">
        <LazyTabContent
          key={`${selectedUserId}-Details`}
          queryType="getUserExtendedProfile"
          userId={selectedUserId}
          isFocused={focusedTab === "Details"}
        />
      </TabsContent>

      <TabsContent value="Settings">
        <LazyTabContent
          key={`${selectedUserId}-Settings`}
          queryType="getUserSetting"
          userId={selectedUserId}
          isFocused={focusedTab === "Settings"}
        />
      </TabsContent>
    </Tabs>
  );
};
