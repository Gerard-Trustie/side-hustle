"use client";

import { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ErrorFallback } from "@/components/ErrorFallback";
import { ErrorBoundary } from "react-error-boundary";
import { getUserBasicProfile } from "@/actions/getUserBasicProfile";
import { getUserExtendedProfile } from "@/actions/getUserExtendedProfile";
import { getUserSetting } from "@/actions/getUserSetting";
import { extractFieldsFromQuery } from "@utils/graphql-utils";

// Assuming queries is imported or defined elsewhere
import * as queries from "../../../graphql/queries";

const AnimatedSpinner = dynamic(() => import("@/components/AnimatedSpinner"), {
  ssr: false,
});

async function fetchData(queryType: string, userId: string) {
  switch (queryType) {
    case "getUserBasicProfile":
      return (await getUserBasicProfile(userId)) || {};
    case "getUserExtendedProfile":
      return (await getUserExtendedProfile(userId)) || {};
    case "getUserSetting":
      return (await getUserSetting(userId)) || {};
    default:
      throw new Error("Invalid query type");
  }
}

export function TabContent({
  queryType,
  userId,
  data,
}: {
  queryType: string;
  userId: string;
  data: any;
}) {
  const getAllFields = () => {
    return Object.entries(queries).reduce((acc, [key, query]) => {
      acc[key] = extractFieldsFromQuery(query);
      return acc;
    }, {});
  };

  const allFields = getAllFields();
  const fields = allFields[queryType] || [];

  return (
    <div className="bg-card-element p-6 rounded-lg shadow-md grid grid-cols-2 gap-4">
      {fields.map((field) => (
        <div key={field} className="flex overflow-hidden">
          <strong className="flex-shrink-0 mr-1">{field}:</strong>
          <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {data[field] !== undefined
              ? typeof data[field] === "string"
                ? data[field]
                : JSON.stringify(data[field])
              : "No value"}
          </span>
        </div>
      ))}
    </div>
  );
}

export function LazyTabContent({
  queryType,
  userId,
  isFocused,
}: {
  queryType: string;
  userId: string;
  isFocused: boolean;
}) {
  const [cachedData, setCachedData] = useState<any>(undefined);

  useEffect(() => {
    if (isFocused && !cachedData) {
      fetchData(queryType, userId).then((data) => {
        setCachedData(data);
      });
    }
  }, [isFocused, queryType, userId, cachedData]);

  if (!isFocused) {
    return null;
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24">
          <AnimatedSpinner size={60} isCircle={false} />
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {cachedData ? (
          <TabContent queryType={queryType} userId={userId} data={cachedData} />
        ) : (
          <div className="flex items-center justify-center py-24">
            <AnimatedSpinner size={60} isCircle={false} />
          </div>
        )}
      </ErrorBoundary>
    </Suspense>
  );
}
