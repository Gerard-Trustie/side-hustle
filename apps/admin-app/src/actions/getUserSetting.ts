"use server";

import { docClient } from "@/utils/dbConfig";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

export const getUserSetting = async (userId: string) => {
  try {
    const command = new GetCommand({
      TableName: process.env.AWS_TABLE_USER!,
      Key: { userId, primarySK: "setting_user" },
    });

    const { Item } = await docClient.send(command);
    return Item;
  } catch (err) {
    console.error(err);
    return null;
  }
};
