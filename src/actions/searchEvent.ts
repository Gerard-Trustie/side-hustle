"use server";

import { invokeLambdaFunction } from "@utils/lambdaConfig";

export const searchEvent = async (
  searchTerm: string,
  type: "post" | "chat",
  userId: string,
  limit: number = 10
) => {
  const result = await invokeLambdaFunction(
    process.env.AWS_LAMBDA_SEARCH_EVENT!,
    {
      arguments: { search: searchTerm, type, userId },
    }
  );

  return result;
};
