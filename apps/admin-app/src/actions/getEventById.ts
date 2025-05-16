"use server";

import { docClient } from "@/utils/dbConfig";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

export const getEventById = async (eventId: string, eventType: string) => {
  try {
    const command = new GetCommand({
      TableName: process.env.AWS_TABLE_EVENT,
      Key: { eventId, eventType },
    });
    console.log("🚀 ~ getEventById ~ command:", command);

    const { Item } = await docClient.send(command);
    return Item;
  } catch (err) {
    console.error(err);
    return null;
  }
};
