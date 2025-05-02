"use server";

import { docClient } from "@/utils/dbConfig";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export const getUserAccounts = async (userId: string) => {
  try {
    const command = new QueryCommand({
      TableName: process.env.AWS_TABLE_USER!,
      KeyConditionExpression:
        "userId = :userId and begins_with(primarySK, :prefix)",
      ExpressionAttributeValues: {
        ":userId": userId,
        ":prefix": "wallet_",
      },
    });
    const { Items } = await docClient.send(command);
    return Items;
  } catch (err) {
    console.error(err);
    return null;
  }
};
