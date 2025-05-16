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
- [ ] Implement authentication for both apps (IAM for admin, Cognito for public)
- [ ] Set up TypeScript project references
- [ ] **Add TypeScript path aliases in `apps/hustle-hub/tsconfig.json` for shared packages**
- [ ] Test both apps locally
- [ ] Set up separate deployment pipelines
- [ ] Document the structure and setup in `/docs`

---

## 8. Next Steps

- Once the structure is in place, incrementally move code and test as you go.
- Keep documentation up to date in `/docs`.
- Ask for help or review if you get stuck on authentication or AWS integration.

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
