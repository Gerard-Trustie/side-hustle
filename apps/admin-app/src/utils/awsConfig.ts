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

export { config };
