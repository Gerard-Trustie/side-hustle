"use client";

import { useEffect } from "react";
import Image from "next/image";
import logo from "@/assets/logo.jpg";
import { Button } from "@components/ui/button";
import { Colors } from "@/themes/colors";
import { clearAuthState } from '@utils/clearAuth';
import { useRouter } from "next/navigation";

// Server Component
export default function Page() {
  const router = useRouter();

  // purge auth state on client side
  useEffect(() => {
    clearAuthState();
    console.log("client side auth purge");
  }, []);

  const onClick = () => {
    console.log("clicked");
    router.push("/login?origin=home");
  };

  const Header = () => {
    return (
      <>
        <div className="flex justify-center mb-6">
          <Image src={logo} alt="Logo" width={100} height={100} />
        </div>
        <h2
          className="text-2xl font-semibold mb-6 text-center"
          style={{ color: Colors.primary }}
        >
          Logged Out
        </h2>
      </>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-card p-20 rounded-lg shadow-md w-200">
        <Header />
        <Button onClick={onClick}>Go Back to Login</Button>
      </div>
    </div>
  );
}
