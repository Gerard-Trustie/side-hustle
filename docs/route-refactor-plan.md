# Authentication and Authorization Refactoring Plan

This document outlines the steps to refactor the Next.js application to support **public** and **admin** roles immediately, with a clear structure and stubs for adding **authenticated user (Cognito)** support in the near future.

## Phase 1: Refactor Route Groups

- [ ] **Rename `(auth)` to `(admin)`:**
    - **Action:** Rename the directory `src/app/(auth)` to `src/app/(admin)`.
    - **Test:** Verify that all pages previously under `(auth)` (like `/home`, `/side-hustle`, etc.) are now accessible via `/home`, `/side-hustle` etc. (as route groups don't affect the URL path) *assuming no middleware is active yet*. Check the browser console for any routing errors.

- [ ] **Create `(user)` group (STUB for future Cognito users):**
    - **Action:** Create a new directory `src/app/(user)`. Add a placeholder page, e.g., `src/app/(user)/dashboard/page.tsx` with `<h1>User Dashboard (Coming Soon)</h1>`.
    - **TODO:** Implement Cognito authentication and user-only features here in the future.
    - **Test:** Navigate to `/dashboard`. You should see the placeholder page content.

- [ ] **Designate Public Routes:**
    - **Action:** Decide on the location for public routes (e.g., use the root `app/` or create `src/app/(public)/`). For now, assume the existing `src/app/login/page.tsx` will serve as a public route.
    - **Test:** Verify that the login page at `/login` is still accessible.

## Phase 2: Review and Evolve Existing Middleware for Access Control

> **Note:** There is already a `src/middleware.ts` in this project. The following steps are about evolving and extending this middleware, not creating it from scratch.

- [ ] **Switch to Regex Matcher for Protected Routes:**
    - **Action:** Replace the explicit matcher array in `middleware.ts` with a regex matcher that protects all admin and user routes (and excludes public/static/login routes). This is a best practice for scalability and maintainability.
    - **Example:**
      ```js
      export const config = {
        matcher: [
          // Protect all routes except for public, static, and login
          '/((?!api|_next/static|_next/image|favicon.ico|login|public).*)',
        ],
      };
      ```
    - **Test:** Try accessing a protected route when not authenticated; you should be redirected to login. When authenticated, you should have access. Public and static routes should remain accessible to everyone.

- [ ] **Modify Middleware for Future Role Checks:**
    - **Action:** Add TODOs and comments in the middleware for future role-based access (e.g., distinguishing admin from user when Cognito is added). For now, authentication is sufficient for admin routes.
    - **TODO:** When Cognito is integrated, add logic to check for user roles and protect user-only routes accordingly.
    - **Test:** N/A for now; this is a placeholder for future work.

- [ ] **Stub User Route Protection (for future Cognito integration):**
    - **Action:** Add a TODO in the middleware for user route protection. For now, allow access to `/dashboard` and other user routes, but add a comment and placeholder logic for future Cognito checks.
    - **TODO:** When Cognito is integrated, check for user authentication and role here.

- [ ] **Allow Public Routes:**
    - **Action:** Ensure the middleware's matcher does not include public routes (like `/login`) or that the logic explicitly allows access to non-matched routes or specifically designated public routes. The `NextResponse.next()` at the end handles routes not caught by specific redirect rules.
    - **Test:** Regardless of authentication status, ensure you can always access `/login` and other public pages.

## Phase 3: (FUTURE) Enhance Authentication System for User Role (Cognito)

- [ ] **Integrate Real Cognito Authentication:**
    - **TODO:** Replace mock or placeholder checks in the middleware with actual Cognito authentication logic (e.g., verifying a session token, calling Amplify Auth, etc.) for user routes.
    - **Test:** Perform a real login. Verify the correct session/token is set. Access user and admin routes; verify access is correctly granted based on the real session. Log out. Verify access is revoked and accessing protected routes redirects to login.

- [ ] **Add Role to User Data/Session:**
    - **TODO:** Update your backend user model/database schema to include a `role` field (`'user'` or `'admin'`). Ensure this role is included in the user's session/token upon login.
    - **Test:** Log in as a regular user. Inspect the session/token to confirm the role is `'user'`. Log in as an admin. Inspect the session/token to confirm the role is `'admin'`.

- [ ] **Update Middleware to Use Real Roles:**
    - **TODO:** Modify the middleware logic to read the `role` from the actual session/token instead of a mock or placeholder when checking access to admin/user routes.
    - **Test:** Log in as a regular user. Attempt to access an admin route (`/home`). Verify redirection to login or an unauthorized page. Log in as an admin. Attempt to access an admin route (`/home`). Verify access is granted. Access a user route (`/dashboard`) as both user types and verify access is granted.

## Phase 4: Adjust UI and Functionality

- [ ] **Conditional Navigation:**
    - **Action:** Update UI components (Header, Sidebar) to fetch the user's session/role and conditionally render links based on authentication status and role. Use client-side hooks (e.g., from your auth provider or a custom one) to get this information.
    - **Test:** Log out: only public links (like Login) should be visible. Log in as a regular user: user links (like Dashboard) and public links should be visible, but not admin links. Log in as an admin: admin links, user links, and public links should be visible.

- [ ] **Update Internal Links:**
    - **Action:** Review all `next/link` components and programmatic navigation (`router.push`) usages. Ensure the `href` values are correct, especially if any page paths *did* change (though route groups shouldn't change them). This is more of a sanity check.
    - **Test:** Click through all navigation links in the header/sidebar for each user type (logged out, user, admin). Verify they lead to the correct pages without errors.

- [ ] **Secure Server Actions/API Routes (Optional but Recommended):**
    - **Action:** Review critical server actions and API routes. Add explicit checks at the beginning of these functions to verify the user's role based on their session, independent of the middleware.
    - **Test:** Try to trigger an admin-only server action while logged in as a regular user (e.g., by manually crafting a request if the UI prevents it). Verify the action fails with an unauthorized error. Trigger the action as an admin and verify it succeeds.

## Phase 5: Final Testing and Cleanup

- [ ] **End-to-End Testing:**
    - **Action:** Perform comprehensive testing simulating all user journeys: public user browsing, admin login, accessing admin pages and performing admin actions, logout. Test edge cases like expired sessions.
    - **TODO:** When user role is implemented, add user login and user page access tests.
    - **Test:** Verify all flows work as expected, access control is rigidly enforced, and no console errors occur.

- [ ] **Code Cleanup:**
    - **Action:** Remove any mock data, temporary console logs, or commented-out old code related to the previous auth structure or the implementation process.
    - **Test:** Briefly re-run key tests (login, accessing different route types) to ensure cleanup didn't break anything.

## Post-Refactor UX Step: Update App Entry Point

- [ ] **Change the default entry point (`/`) to a public page:**
    - **Action:** Replace the current login page at `/` with a public directory listing or landing page.
    - **Action:** Move the login functionality to a top menu or a dedicated `/login` route.
    - **Test:** Visiting `/` as a non-authenticated user shows the public page, not the login form. Login is accessible from the menu.

**Summary:**
- Immediately support public and admin users with clear route groups and middleware.
- Add stubs and TODOs for user (Cognito) support, so it can be added with minimal refactor in the future.
- Keep the codebase organized for easy expansion to three roles.
- Track the entry point/UX change as a coordinated but separate step.

```
