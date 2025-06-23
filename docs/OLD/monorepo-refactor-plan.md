# Monorepo Refactor Plan: Admin & Public-Facing Apps

## Overview
This plan outlines how to refactor the current Next.js project into a monorepo containing two separate apps:

- **Admin App**: For internal/admin users, authenticated via AWS IAM.
- **Public-Facing App (Hustle Hub)**: For end users, with both public and Cognito-authenticated pages.

The goal is to maximize code sharing (especially TypeScript types and business logic), keep UI components separate, and use a simple, best-practice structure that is beginner-friendly and future-proof.

---

## 1. Proposed Directory Structure

```
/ (repo root)
  /apps
    /admin-app         # Next.js app for admin users
    /hustle-hub        # Next.js app for public-facing site
  /packages
    /types             # Shared TypeScript types
    /utils             # Shared utility functions
    /aws               # Shared AWS config/helpers (optional)
  /docs                # Documentation
  /node_modules
  package.json         # Monorepo root (can use workspaces later if needed)
  ...                  # Other config files (tsconfig.json, .gitignore, etc.)
```

- **Each app** has its own `package.json`, `next.config.js`, and `public/` directory.
- **Shared code** (types, utils, AWS helpers) lives in `/packages` and is imported by both apps.
- **No monorepo tooling (Turborepo/Nx)** is required at first, but the structure allows for easy adoption later.

---

## 2. Migration Steps

1. **Set Up the Monorepo Structure**
   - Create the `/apps` and `/packages` directories.
   - Move the current Next.js app into `/apps/admin-app` as a starting point.
   - Create a new Next.js app in `/apps/hustle-hub` (can use `npx create-next-app`).

2. **Extract Shared Code**
   - Move all TypeScript types to `/packages/types`.
   - Move utility functions (e.g., AWS/DynamoDB helpers) to `/packages/utils` or `/packages/aws`.
   - Update import paths in both apps to use the shared packages.

3. **Separate UI Components**
   - Keep UI components in each app's `/components` directory.
   - Only move components to `/packages` if they are truly shared and generic.

4. **Set Up Authentication**
   - **Admin App**: Implement AWS IAM authentication (can start with a simple sign-in or restrict by IP/VPC if easier).
   - **Hustle Hub**: Implement AWS Cognito authentication for user login. Keep public pages accessible without auth.

5. **Configure TypeScript and Build**
   - Set up `tsconfig.json` references so both apps can import from `/packages`.
   - **Add TypeScript path aliases in `apps/hustle-hub/tsconfig.json` for shared packages** (e.g., `@types/*` for `/packages/types/*`, `@utils/*` for `/packages/utils/*`).
   - Ensure both apps build and run independently.

6. **Test and Validate**
   - Test both apps locally to ensure shared code works and authentication flows are correct.
   - Validate that DynamoDB integration works from both apps.

7. **Prepare for Deployment**
   - Decide on deployment targets (e.g., Vercel, AWS Amplify, custom).
   - Set up separate deployment pipelines for each app.

---

## 3. Shared Code Strategy

- **Types**: All TypeScript interfaces, types, and enums go in `/packages/types`.
- **Utils**: Shared utility functions (e.g., date formatting, AWS helpers) go in `/packages/utils` or `/packages/aws`.
- **Business Logic**: If there is logic that is not UI-specific and is used in both apps, move it to `/packages`.
- **UI Components**: Only share if they are generic and used in both apps; otherwise, keep separate.

---

## 4. Authentication Setup

- **Admin App**:
  - Use AWS IAM for authentication.
  - For simplicity, you can start with a basic sign-in page that checks IAM credentials, or restrict access by IP/VPC.
  - **Do NOT add Cognito authentication at this stage.**
  - Later, consider using AWS SSO or Cognito with an admin group for more flexibility.

- **Hustle Hub (Public App)**:
  - Use AWS Cognito for user authentication.
  - Public pages do not require authentication.
  - Authenticated pages require Cognito login.
  - Use Next.js middleware or API routes to protect authenticated pages.

---

## 5. Deployment Recommendations

- **Deploy each app separately** (e.g., two Vercel projects, two Amplify apps, or two S3 buckets with CloudFront).
- This keeps admin and public apps isolated and easier to manage.
- Each app can have its own domain/subdomain (e.g., `admin.example.com`, `app.example.com`).
- Shared packages do not need to be deployed; they are used at build time.

---

## 6. Potential Pitfalls & Things to Watch Out For

- **Import Paths**: Make sure both apps import shared code using relative or workspace paths.
- **TypeScript Config**: Set up `tsconfig.json` references correctly to avoid type errors.
- **Authentication Complexity**: IAM auth can be tricky; start simple and iterate.
- **Shared Code Changes**: Changes in `/packages` can affect both apps—test both after updates.
- **Deployment**: Ensure environment variables and AWS credentials are set up separately for each app.
- **No Monorepo Tooling at First**: If the project grows, consider adding Turborepo or Nx for better build/test/dev workflows.

---

## 7. Migration Checklist

- [x] Create `/apps` and `/packages` directories
- [x] Move current app to `/apps/admin-app`
- [x] Scaffold `/apps/hustle-hub` (new Next.js app)
- [x] Extract and move shared types to `/packages/types`
- [x] Extract and move shared utils to `/packages/utils` or `/packages/aws`
- [x] Update import paths in both apps
- [x] Separate UI components for each app
- [x] Implement authentication for admin app (Cognito configured and working)
- [ ] Implement authentication for public app (NOT NEEDED YET - will be added later for specific features)
- [x] Set up TypeScript project references
- [x] **Add TypeScript path aliases in both app `tsconfig.json` files for shared packages**
- [x] Test both apps locally (both apps build successfully)
- [ ] Set up separate deployment pipelines
- [x] Document the structure and setup in `/docs`

### Current Status Notes:
- ✅ **Monorepo structure is fully implemented** - Both apps exist with proper separation
- ✅ **Shared packages working** - Types and utils are properly extracted and being used
- ✅ **TypeScript configuration complete** - Path aliases set up for both apps
- ✅ **Admin app authentication** - Cognito is configured and working
- ✅ **Build verification** - Both apps build successfully without errors
- ⏭️ **Public app authentication** - Intentionally skipped for now, will be added for specific features later
- ❌ **Deployment pipelines** - Still need to be set up

---

## 8. Verification Tests

### ✅ Structure Verification Tests
Run these tests to confirm the monorepo structure is working correctly:

```bash
# 1. Verify directory structure
ls -la apps/          # Should show admin-app and hustle-hub
ls -la packages/      # Should show types and utils

# 2. Verify both apps have separate package.json files
cat apps/admin-app/package.json | head -5
cat apps/hustle-hub/package.json | head -5

# 3. Verify shared packages exist
ls -la packages/types/
ls -la packages/utils/
```

### ✅ Build Verification Tests
```bash
# 4. Test admin app build
cd apps/admin-app && npm run build

# 5. Test hustle-hub app build  
cd ../hustle-hub && npm run build

# 6. Test TypeScript compilation
cd ../admin-app && npx tsc --noEmit
cd ../hustle-hub && npx tsc --noEmit
```

### ✅ Import Path Verification Tests
```bash
# 7. Verify admin app imports from shared packages
grep -r "@types" apps/admin-app/src/
grep -r "@utils" apps/admin-app/src/

# 8. Check TypeScript path aliases are configured
cat apps/admin-app/tsconfig.json | grep -A 10 "paths"
cat apps/hustle-hub/tsconfig.json | grep -A 10 "paths"
```

### ✅ Authentication Verification Tests

#### Admin App Authentication (Cognito)
```bash
# 9. Verify Cognito configuration exists
grep -r "aws_user_pools_id" apps/admin-app/src/
grep -r "aws_cognito" apps/admin-app/src/

# 10. Check environment variables are referenced
grep -r "NEXT_PUBLIC_AWS" apps/admin-app/
```

#### Manual Authentication Test for Admin App:
1. Run `cd apps/admin-app && npm run dev`
2. Navigate to `http://localhost:3000`
3. Verify login page appears
4. Test login with valid Cognito credentials
5. Verify protected routes require authentication

### 🔄 Development Server Tests
```bash
# 11. Test admin app dev server
cd apps/admin-app && npm run dev
# Should start without errors on port 3000

# 12. Test hustle-hub dev server (in separate terminal)
cd apps/hustle-hub && npm run dev --port 3001
# Should start without errors on port 3001
```

### ✅ Shared Code Integration Tests
```bash
# 13. Verify shared types are being used
grep -r "TUser\|TPost" apps/admin-app/src/ | wc -l
# Should show multiple uses of shared types

# 14. Verify shared utilities are being used  
grep -r "fetchUserAttributesFromServer\|clearAuthState" apps/admin-app/src/
# Should show utilities being imported from @utils
```

---

## 9. Next Steps

Based on verification results, you are currently at **Phase 7** of the migration plan with the following status:

### ✅ Completed Successfully:
- Monorepo structure fully implemented
- Both apps building and running independently  
- Shared packages extracted and working
- TypeScript configuration complete
- Admin app Cognito authentication implemented
- Import paths updated correctly

### 🚧 Next Immediate Tasks:
1. **Set up separate deployment pipelines** for both apps
2. **Add environment variable management** for each app deployment
   - ✅ Copy `.env` to each app directory for local development
   - ❌ Configure environment variables for production deployment
   - ❌ Set up different environment files for staging/production
3. **Configure domain/subdomain strategy** (e.g., admin.yoursite.com, app.yoursite.com)

### 🔮 Future Tasks (when needed):
1. **Add Cognito authentication to hustle-hub** for specific user features
2. **Consider adding monorepo tooling** (Turborepo/Nx) if the project grows
3. **Set up shared component library** if UI components become truly reusable

---

## 10. Common Issues & Troubleshooting

### Environment Variables Issue (SOLVED ✅)
**Problem**: "Unable to get user session following successful sign-in" after TOTP authentication.

**Root Cause**: When refactoring from single app to monorepo, the `.env` file remained at the root level, but the admin app in `apps/admin-app/` couldn't access the environment variables needed for AWS Cognito authentication.

**Solution**: Copy the root `.env` file to each app directory:
```bash
# Copy environment variables to admin app
cp .env apps/admin-app/.env

# For future: Copy to public app when needed
cp .env apps/hustle-hub/.env
```

**Required Environment Variables for Admin App**:
```
NEXT_PUBLIC_AWS_REGION=eu-west-1
NEXT_PUBLIC_AWS_USER_POOLS_ID=eu-west-1_XXXXXXX
NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID=XXXXXXXXXXXXXX
NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID=eu-west-1:XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
AWS_USER_FILES_S3_BUCKET=your-s3-bucket
AWS_TABLE_USER=your-user-table
AWS_TABLE_EVENT=your-event-table
# ... other AWS resources
```

### Prevention for Future Deployments
When deploying each app separately:
1. Each app needs its own `.env` file with appropriate variables
2. Use different environment variable sets for different environments (dev/staging/prod)
3. Never commit `.env` files to version control
4. Consider using `.env.example` files to document required variables

---

**Appendix: Additional Implementation Notes for Beginners**

### Updating Import Paths
After moving shared code to `/packages`, update all imports in both apps to use the new paths. If using workspaces, you can import as `import { X } from 'types'` or `import { Y } from 'utils'`.

### TypeScript Project References
In each app's `tsconfig.json`, add:
```json
{
  "references": [
    { "path": "../../packages/types" },
    { "path": "../../packages/utils" }
  ]
}
```
In the root `tsconfig.json`, include all apps and packages in `references`.

### Linking Local Packages with Workspaces
Use Yarn or NPM workspaces in the root `package.json`:
```json
{
  "workspaces": ["apps/*", "packages/*"]
}
```
This allows you to import shared code as packages.

### Environment Variable Management
Each app should have its own `.env` file for AWS credentials and config. **Do not share AWS secrets between apps.**

### Testing Shared Code Changes
After updating shared code, restart both apps to ensure changes are picked up and no errors are introduced.

### Scaffolding a New Next.js App
To create the public app, run:
```
npx create-next-app apps/hustle-hub
```

### TypeScript Path Aliases for Shared Packages
In `apps/hustle-hub/tsconfig.json`, add recommended aliases:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@types/*": ["../../packages/types/*"],
      "@utils/*": ["../../packages/utils/*"]
    }
  }
}
```
This allows you to import shared code as `import { X } from '@types/...'` or `import { Y } from '@utils/...'`.

---

**End of Plan** 
