"use server";

import { invokeLambdaFunction } from "@utils/lambdaConfig";

export const usageStatistics = async (statsType: string) => {
  const result = await invokeLambdaFunction(
    process.env.AWS_LAMBDA_USAGE_STATISTICS!,
    {
      arguments: { statsType },
    }
  );

  return result;
};
