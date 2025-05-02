"use client";
import { useEffect } from "react";

import { Amplify } from "aws-amplify";
import { config } from "@/utils/awsConfig"; //client side using NEXT_PUBLIC values
import { clearAuthState } from "@/utils/clearAuth";

Amplify.configure({ ...config }, { ssr: true });

export default function ConfigureAmplifyClientSide() {
  // purge auth state on client side
  // useEffect(() => {
  //   clearAuthState();
  //   console.log("client side auth purge");
  // }, []);

  return null;
}
