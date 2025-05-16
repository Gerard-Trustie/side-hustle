import { signOut } from "aws-amplify/auth";

export async function clearAuthState() {
  // Clear local storage
  localStorage.clear();

  // Clear cookies
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
  console.log("cleared auth state");

  // Sign out the user
  try {
    await signOut();
    console.log("signed out");
  } catch (error) {
    console.error("Error signing out:", error);
  }
}
