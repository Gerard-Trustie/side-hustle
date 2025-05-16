"use client";

import Image from "next/image";
import logo from "@/assets/logo.jpg";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { redirect } from "next/navigation";
import { Colors } from "@/themes/colors";

const formFields = {
  signIn: {
    username: {
      placeholder: "Enter email",
      isRequired: true,
      label: "Enter your email",
    },
  },
};

// Server Component
export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  console.log("🚀 ~ searchParams:", searchParams);

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
            const origin = searchParams?.origin || "/home";
            if (origin) {
              redirect(origin);
            }
            return (
              <main>
                {/* <MenuDrawer>{renderContent()}</MenuDrawer> */}
                <button onClick={signOut}>Sign out</button>
              </main>
            );
          }}
        </Authenticator>
      </div>
    </div>
  );
}
