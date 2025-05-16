"use server";

import { docClient } from "@/utils/dbConfig";
import { ScanCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";

type TUpdateAllUsersFeedParams = {
  newDate: string;
  newChatEventId: string;
  postUserId: string;
};

export const updateAllUsersFeed = async ({
  newDate,
  newChatEventId,
  postUserId,
}: TUpdateAllUsersFeedParams) => {
  let lastEvaluatedKey = undefined;
  const batchSize = 25; // DynamoDB batch write limit is 25 items

  do {
    // Scan users
    const scanCommand = {
      TableName: process.env.AWS_TABLE_USER,
      FilterExpression: "primarySK = :profileSK",
      ExpressionAttributeValues: {
        ":profileSK": "basic_profile",
      },
      ExclusiveStartKey: lastEvaluatedKey,
    };

    const userScan = await docClient.send(new ScanCommand(scanCommand));
    lastEvaluatedKey = userScan.LastEvaluatedKey;

    // Prepare batch writes for feeds
    const feedUpdates = userScan.Items.map((user) => ({
      PutRequest: {
        Item: {
          userId: user.userId,
          primarySK: `feed_${newDate}_${newChatEventId}`,
          friendId: postUserId,
        },
      },
    }));

    // Split into chunks of 25 items
    for (let i = 0; i < feedUpdates.length; i += batchSize) {
      const batch = feedUpdates.slice(i, i + batchSize);
      const batchWriteCommand = new BatchWriteCommand({
        RequestItems: {
          [process.env.AWS_TABLE_USER]: batch,
        },
      });

      await docClient.send(batchWriteCommand);
    }
  } while (lastEvaluatedKey);
};
