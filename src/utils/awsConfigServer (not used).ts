"use server";
import { ResourcesConfig } from "aws-amplify";

//not used using NEXT_PUBLIC instead

// export async function getConfigAuth() {
//   const config: ResourcesConfig = {
//     Auth: {
//       Cognito: {
//         region: process.env.AWS_REGION!,
//         userPoolId: process.env.AWS_USER_POOLS_ID!,
//         userPoolClientId: process.env.AWS_USER_POOLS_WEB_CLIENT_ID!,
//         userPoolWebClientId: process.env.AWS_USER_POOLS_WEB_CLIENT_ID!,
//         identityPoolId: process.env.AWS_COGNITO_IDENTITY_POOL_ID!,
//       },
//     },
//   };
// }

export async function getConfigAuth() {
  const config = {
    aws_user_pools_id: process.env.NEXT_PUBLIC_AWS_USER_POOLS_ID,
    aws_user_pools_web_client_id:
      process.env.NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID,
    aws_cognito_identity_pool_id:
      process.env.NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID,
    aws_project_region: process.env.NEXT_PUBLIC_AWS_REGION,
  } as const;

  return config;
}
