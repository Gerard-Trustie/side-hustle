"use server";

import { invokeLambdaFunction } from "@/utils/lambdaConfig";

export const searchUser = async (searchTerm: string) => {
  const result = await invokeLambdaFunction(
    process.env.AWS_LAMBDA_SEARCH_USER!,
    {
      arguments: { search: searchTerm },
    }
  );

  return result;
};
