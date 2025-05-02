"use server";

import { docClient } from "@/utils/dbConfig";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

export const getUserExtendedProfile = async (userId: string) => {
  try {
    const command = new GetCommand({
      TableName: process.env.AWS_TABLE_USER!,
      Key: { userId, primarySK: "details" },
    });

    const { Item } = await docClient.send(command);
    return Item;
  } catch (err) {
    console.error(err);
    return null;
  }
};
