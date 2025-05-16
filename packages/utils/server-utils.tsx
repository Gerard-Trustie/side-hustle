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
  const currentSession = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (contextSpec) => fetchAuthSession(contextSpec),
  });
  return currentSession;
};

export const fetchUserFromServer = async () => {
  const currentUser = runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (contextSpec) => getCurrentUser(contextSpec),
  });
  return currentUser;
};

export const fetchUserAttributesFromServer = async () => {
  const currentUser = runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (contextSpec) => fetchUserAttributes(contextSpec),
  });
  return currentUser;
};

export const cookiesClient = generateServerClientUsingCookies({
  config,
  cookies,
}); 
