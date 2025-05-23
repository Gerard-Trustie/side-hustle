import {
  fetchAuthSession,
  getCurrentUser,
  fetchUserAttributes,
} from "aws-amplify/auth/server";
import { cookies } from "next/headers";
import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { config } from "@/utils/awsConfig"; //this is using NEXT_PUBLIC values to be avialble client side
import { generateServerClientUsingReqRes } from "@aws-amplify/adapter-nextjs/api";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";

console.log("🚀 ~ server-utils config:", config);

export const { runWithAmplifyServerContext } = createServerRunner({
  config,
});

export const reqResBasedClient = generateServerClientUsingReqRes({
  config,
});

export const fetchSessionFromServer = async () => {
  console.log("🔍 [SERVER-UTILS] Fetching session from server...");
  try {
    const currentSession = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => fetchAuthSession(contextSpec),
    });
    console.log("🔍 [SERVER-UTILS] Session result:", currentSession);
    console.log("🔍 [SERVER-UTILS] Session tokens present:", !!currentSession?.tokens);
    return currentSession;
  } catch (error) {
    console.error("🔍 [SERVER-UTILS] ❌ Error fetching session:", error);
    throw error;
  }
};

export const fetchUserFromServer = async () => {
  console.log("🔍 [SERVER-UTILS] Fetching user from server...");
  try {
    const currentUser = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => getCurrentUser(contextSpec),
    });
    console.log("🔍 [SERVER-UTILS] User result:", currentUser);
    console.log("🔍 [SERVER-UTILS] User ID:", currentUser?.userId);
    return currentUser;
  } catch (error) {
    console.error("🔍 [SERVER-UTILS] ❌ Error fetching user:", error);
    throw error;
  }
};

export const fetchUserAttributesFromServer = async () => {
  console.log("🔍 [SERVER-UTILS] Fetching user attributes from server...");
  try {
    const currentUser = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => fetchUserAttributes(contextSpec),
    });
    console.log("🔍 [SERVER-UTILS] User attributes result:", currentUser);
    return currentUser;
  } catch (error) {
    console.error("🔍 [SERVER-UTILS] ❌ Error fetching user attributes:", error);
    throw error;
  }
};

export const cookiesClient = generateServerClientUsingCookies({
  config,
  cookies,
}); 
