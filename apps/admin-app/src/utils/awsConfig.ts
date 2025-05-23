import { ResourcesConfig } from "aws-amplify";

// const config: ResourcesConfig = {
//   Auth: {
//     Cognito: {
//       userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOLS_ID!,
//       userPoolClientId: process.env.NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID!,
//       identityPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID!,
//     },
//   },
// };

const config = {
  aws_user_pools_id: process.env.NEXT_PUBLIC_AWS_USER_POOLS_ID,
  aws_user_pools_web_client_id:
    process.env.NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID,
  aws_cognito_identity_pool_id:
    process.env.NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID,
  aws_project_region: process.env.NEXT_PUBLIC_AWS_REGION,
} as const;

// DIAGNOSTIC: Log the configuration and check for missing values
console.log("🔍 [DIAGNOSTIC] AWS Config loaded:", config);
console.log("🔍 [DIAGNOSTIC] Environment check:", {
  userPoolId: !!process.env.NEXT_PUBLIC_AWS_USER_POOLS_ID,
  clientId: !!process.env.NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID,
  identityPoolId: !!process.env.NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID,
  region: !!process.env.NEXT_PUBLIC_AWS_REGION,
});

// Check for undefined values
Object.entries(config).forEach(([key, value]) => {
  if (!value) {
    console.error(
      `❌ [DIAGNOSTIC] Missing environment variable for ${key}:`,
      value
    );
  }
});

export { config };
