"use client";

import Image from "next/image";
import logo from "@/assets/logo.jpg";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Colors } from "@/themes/colors";
import { I18n } from 'aws-amplify/utils';

// Configure custom translations for TOTP
I18n.putVocabularies({
  en: {
    'Confirm TOTP Code': 'Enter the Code from your Authenticator App',
    'Please confirm the TOTP code:': 'Please enter the code from your authenticator app:',
    'Code': 'Authenticator Code',
    'Confirm': 'Verify Code',
    'TOTP Code': 'Authenticator Code',
  }
});

I18n.setLanguage('en');

const formFields = {
  signIn: {
    username: {
      placeholder: "Enter email",
      isRequired: true,
      label: "Enter your email",
    },
  },
};

// Separate component for authenticated content
function AuthenticatedContent({ 
  signOut, 
  user, 
  origin 
}: { 
  signOut: any; 
  user: any; 
  origin: string; 
}) {
  const router = useRouter();

  // DIAGNOSTIC: Log authentication state
  console.log("🔍 [DIAGNOSTIC] Authentication successful!");
  console.log("🔍 [DIAGNOSTIC] User object:", user);
  console.log("🔍 [DIAGNOSTIC] User userId:", user?.userId);
  console.log("🔍 [DIAGNOSTIC] Should redirect to:", origin);

  // Handle redirect only once when user is authenticated
  useEffect(() => {
    if (user?.userId && origin) {
      console.log("🔍 [DIAGNOSTIC] Performing client-side redirect to:", origin);
      router.push(origin);
    }
  }, [user?.userId, origin, router]);

  return (
    <main>
      {/* <MenuDrawer>{renderContent()}</MenuDrawer> */}
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

// Server Component
export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  console.log("🚀 ~ searchParams:", searchParams);
  const router = useRouter();

  const components = {
    Header() {
      return (
        <>
          <div className="flex justify-center mb-6">
            <Image src={logo} alt="Logo" width={100} height={100} />
          </div>
          <h2
            className="text-2xl font-semibold mb-6 text-center"
            style={{ color: Colors.primary }}
          >
            Login
          </h2>
        </>
      );
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-card p-8 rounded-lg shadow-md w-200">
        <Authenticator
          loginMechanisms={["email"]}
          formFields={formFields}
          hideSignUp
          components={components}
        >
          {({ signOut, user }) => {
            const origin = Array.isArray(searchParams?.origin) ? searchParams.origin[0] : (searchParams?.origin || "/home");
            
            return (
              <AuthenticatedContent 
                signOut={signOut} 
                user={user} 
                origin={origin}
              />
            );
          }}
        </Authenticator>
      </div>
    </div>
  );
}
