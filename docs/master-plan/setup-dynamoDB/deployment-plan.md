# DynamoDB Infrastructure Deployment Plan

**Status**: Ready for Development Deployment  
**Target Architecture**: AWS Amplify + Cognito + DynamoDB (Aligned with admin-app pattern)

This document outlines the step-by-step plan to deploy the Hustle Hub DynamoDB infrastructure, following the proven authentication architecture from the admin-app template.

## Authentication Architecture (Aligned with admin-app)

### Frontend Authentication: AWS Amplify + Cognito
- **User Authentication**: Cognito User Pools with Hosted UI
- **Session Management**: AWS Amplify for Next.js
- **Route Protection**: Middleware using Cognito session cookies
- **Client Libraries**: `aws-amplify`, `@aws-amplify/adapter-nextjs`

### Backend Database Access: IAM Roles + AWS SDK  
- **DynamoDB Access**: Direct AWS SDK with IAM role authentication
- **Server Actions**: Next.js "use server" actions with `@aws-sdk/lib-dynamodb`
- **No Token Passing**: Server-side IAM eliminates need to pass Cognito tokens to DynamoDB

### Security Model
```
[User] → [Cognito Login] → [Amplify Session] → [Next.js Server Actions] → [IAM Role] → [DynamoDB]
```

This pattern is proven in the admin-app and provides optimal security and performance.

## Prerequisites

### Required AWS Permissions
Ensure your AWS account has permissions for:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow", 
      "Action": [
        "dynamodb:*",
        "cognito-idp:*",
        "cognito-identity:*",
        "iam:*",
        "cloudformation:*",
        "cdk:*"
      ],
      "Resource": "*"
    }
  ]
}
```

### Development Environment
- AWS CLI configured with appropriate permissions
- AWS CDK CLI installed (`npm install -g aws-cdk`)
- Node.js 18+ 
- Cognito User Pool (can reuse from admin-app or create new)

## Phase 1: Infrastructure Deployment (CDK)

### Step 1.1: Prepare CDK Environment

```bash
# Navigate to the DynamoDB setup directory
cd docs/master-plan/setup-dynamoDB

# Install CDK dependencies
npm init -y
npm install aws-cdk-lib constructs @types/node typescript ts-node

# Initialize CDK (if not already done)
cdk init app --language typescript

# Bootstrap CDK (one-time per account/region)
cdk bootstrap
```

### Step 1.2: Deploy Development Infrastructure

```bash
# Deploy the DynamoDB stack
cdk deploy HustleHubStack-development

# Expected outputs:
# - DynamoDB table: HustleHubDirectory-development
# - IAM role: HustleHubAppRole-development
# - Environment variables for application
```

### Step 1.3: Verify Infrastructure

```bash
# List DynamoDB tables
aws dynamodb list-tables --region eu-west-2

# Describe the table and verify GSIs
aws dynamodb describe-table --table-name HustleHubDirectory-development --region eu-west-2

# Check GSI status (should be ACTIVE)
aws dynamodb describe-table --table-name HustleHubDirectory-development --query 'Table.GlobalSecondaryIndexes[].IndexStatus' --region eu-west-2
```

## Phase 2: Authentication Setup (Cognito + Amplify)

### Step 2.1: Cognito Configuration

**Option A: Reuse admin-app Cognito**
```bash
# Get existing Cognito details from admin-app
aws cognito-idp describe-user-pool --user-pool-id <admin-app-user-pool-id>

# Create new app client for hustle-hub
aws cognito-idp create-user-pool-client \
  --user-pool-id <admin-app-user-pool-id> \
  --client-name "hustle-hub-web" \
  --generate-secret false \
  --supported-identity-providers COGNITO
```

**Option B: Create New Cognito (Recommended)**
```bash
# Create new User Pool for hustle-hub
aws cognito-idp create-user-pool \
  --pool-name "hustle-hub-users" \
  --policies "PasswordPolicy={MinimumLength=8,RequireUppercase=true,RequireLowercase=true,RequireNumbers=true}" \
  --username-attributes email \
  --auto-verified-attributes email

# Create app client
aws cognito-idp create-user-pool-client \
  --user-pool-id <new-user-pool-id> \
  --client-name "hustle-hub-web" \
  --generate-secret false
```

### Step 2.2: Environment Configuration

Create `.env.local` in the hustle-hub app:

```env
# Authentication (matches admin-app pattern)
NEXT_PUBLIC_AWS_USER_POOLS_ID=eu-west-2_xxxxxxxxx
NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID=eu-west-2:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_AWS_REGION=eu-west-2

# DynamoDB
AWS_REGION=eu-west-2
DYNAMODB_TABLE_NAME=HustleHubDirectory-development
AWS_TABLE_NAME=HustleHubDirectory-development
```

### Step 2.3: Install Authentication Dependencies

```bash
# Navigate to hustle-hub app
cd ../../apps/hustle-hub

# Install Amplify dependencies (matches admin-app)
npm install aws-amplify @aws-amplify/adapter-nextjs @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
```

## Phase 3: Data Access Layer Implementation

### Step 3.1: Copy Database Configuration (from admin-app)

Create `src/lib/dbConfig.ts`:
```typescript
"use server";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, TranslateConfig } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION! });

const marshallOptions: TranslateConfig["marshallOptions"] = {
  convertEmptyValues: false,
  removeUndefinedValues: true,
  convertClassInstanceToMap: false,
};

const unmarshallOptions: TranslateConfig["unmarshallOptions"] = {
  wrapNumbers: false,
};

const translateConfig: TranslateConfig = {
  marshallOptions,
  unmarshallOptions,
};

const docClient = DynamoDBDocumentClient.from(ddbClient, translateConfig);

export { docClient };
```

### Step 3.2: Copy Authentication Configuration (from admin-app)

Create `src/lib/awsConfig.ts`:
```typescript
const config = {
  aws_user_pools_id: process.env.NEXT_PUBLIC_AWS_USER_POOLS_ID,
  aws_user_pools_web_client_id: process.env.NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID,
  aws_cognito_identity_pool_id: process.env.NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID,
  aws_project_region: process.env.NEXT_PUBLIC_AWS_REGION,
} as const;

export { config };
```

### Step 3.3: Copy Server Utilities (from admin-app)

Create `src/lib/server-utils.ts`:
```typescript
import {
  fetchAuthSession,
  getCurrentUser,
  fetchUserAttributes,
} from "aws-amplify/auth/server";
import { cookies } from "next/headers";
import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { config } from "@/lib/awsConfig";

export const { runWithAmplifyServerContext } = createServerRunner({
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
```

## Phase 4: Data Seeding & Testing

### Step 4.1: Create Seed Data Script

```typescript
// scripts/seedData.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'eu-west-2' });
const docClient = DynamoDBDocumentClient.from(client);

// Transform enhanced listings to DynamoDB format
// (Implementation matches the data structure in dynamoDB_table_design.md)
```

### Step 4.2: Test Data Operations

```bash
# Count items
aws dynamodb scan --table-name HustleHubDirectory-development --select COUNT --region eu-west-2

# Test category query
aws dynamodb query \
  --table-name HustleHubDirectory-development \
  --key-condition-expression "PK = :pk" \
  --expression-attribute-values '{":pk":{"S":"CATEGORIES"}}' \
  --region eu-west-2
```

## Phase 5: Application Integration

### Step 5.1: Implement Access Patterns

Create server actions following admin-app pattern:

```typescript
// actions/getCategories.ts
"use server";

import { docClient } from "@/lib/dbConfig";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export const getCategories = async () => {
  try {
    const command = new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": "CATEGORIES",
      },
    });

    const { Items } = await docClient.send(command);
    return Items || [];
  } catch (err) {
    console.error(err);
    return [];
  }
};
```

### Step 5.2: Implement Middleware (copy from admin-app)

Create `src/middleware.ts` using the proven pattern from admin-app.

### Step 5.3: Configure Route Protection

Update `next.config.js` and implement the `(auth)` route group pattern.

## Phase 6: Environment Configuration

### Step 6.1: Development Environment

```env
# .env.local
DYNAMODB_TABLE_NAME=HustleHubDirectory-development
AWS_REGION=eu-west-2

# Copy exact Cognito settings from admin-app working environment
NEXT_PUBLIC_AWS_USER_POOLS_ID=<from-admin-app>
NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID=<from-admin-app>
NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID=<from-admin-app>
NEXT_PUBLIC_AWS_REGION=eu-west-2
```

### Step 6.2: IAM Role Configuration

The CDK automatically creates the IAM role with correct DynamoDB permissions. No manual IAM configuration needed.

## Phase 7: Testing & Validation

### Step 7.1: Authentication Testing
- [ ] User signup/login through Cognito
- [ ] Route protection via middleware
- [ ] Session persistence
- [ ] Logout functionality

### Step 7.2: Database Testing  
- [ ] Category listing
- [ ] Listing queries by category
- [ ] User profile operations
- [ ] Favourites functionality

### Step 7.3: Integration Testing
- [ ] End-to-end user flows
- [ ] Performance testing
- [ ] Error handling

## Phase 8: Production Deployment

### Step 8.1: Production Infrastructure
```bash
cdk deploy HustleHubStack-production
```

### Step 8.2: Production Environment Variables
```env
DYNAMODB_TABLE_NAME=HustleHubDirectory-production
# Production Cognito settings
```

## Success Criteria

- [ ] All DynamoDB tables created successfully
- [ ] Authentication flow matches admin-app pattern
- [ ] All access patterns working
- [ ] Performance within targets (<100ms queries)
- [ ] Security audit passed
- [ ] Full test coverage
- [ ] Production deployment successful

## Cost Estimates

**Development Environment**: £30-45/month
- DynamoDB (Pay-per-request): £20-30
- Cognito (Free tier): £0
- CloudWatch: £5-10

**Production Environment**: £60-85/month  
- DynamoDB: £40-60
- Cognito: £5-15
- CloudWatch: £10-15

## Rollback Procedures

### Database Rollback
```bash
cdk destroy HustleHubStack-development
```

### Application Rollback
```bash
# Restore previous environment variables
# Revert authentication configuration
```

## Support and Alignment

This deployment plan aligns perfectly with your colleague's admin-app architecture:

- ✅ **Same Authentication**: AWS Amplify + Cognito
- ✅ **Same Database Access**: IAM roles + AWS SDK
- ✅ **Same Security Model**: Server-side actions
- ✅ **Same Environment Pattern**: Environment variables
- ✅ **Same Dependencies**: Identical package versions

Your colleague can easily support this setup since it mirrors their proven implementation! 
