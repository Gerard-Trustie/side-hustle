"use server";

import { docClient } from "@/utils/dbConfig";
import { PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { TResource } from "@/app/(auth)/knowledge/knowledge.types";

export type Tag = {
  id: string;
  name: string;
};

export async function addResource(
  resource: Omit<TResource, "resourceId" | "dateAdded" | "lastModified" | "SK">
) {
  const now = new Date().toISOString();
  const resourceId = randomUUID();

  const newResource = {
    ...resource,
    resourceId,
    PK: resourceId,
    SK: now,
    dateAdded: now,
    lastModified: now,
  };

  const command = new PutCommand({
    TableName: process.env.AWS_TABLE_KNOWLEDGE,
    Item: newResource,
  });

  try {
    await docClient.send(command);
    revalidatePath("/knowledge");
    return { success: true, data: newResource };
  } catch (error) {
    return { success: false, error: "Failed to add resource" };
  }
}

export async function getResources() {
  const command = new QueryCommand({
    TableName: process.env.AWS_TABLE_KNOWLEDGE,
    // Add any necessary query parameters
  });

  try {
    const { Items } = await docClient.send(command);
    return Items as TResource[];
  } catch (error) {
    throw new Error("Failed to fetch resources");
  }
}

export async function updateResource(
  SK: string,
  resourceId: string,
  updates: Partial<TResource>
) {
  const updateExpressions: string[] = [];
  const expressionAttributeValues: Record<string, any> = {};
  const expressionAttributeNames: Record<string, string> = {};

  Object.entries(updates).forEach(([key, value]) => {
    if (key !== "resourceId") {
      updateExpressions.push(`#${key} = :${key}`);
      expressionAttributeValues[`:${key}`] = value;
      expressionAttributeNames[`#${key}`] = key;
    }
  });

  const command = new UpdateCommand({
    TableName: process.env.AWS_TABLE_KNOWLEDGE,
    Key: { SK, PK: resourceId },
    UpdateExpression: `SET ${updateExpressions.join(
      ", "
    )}, lastModified = :lastModified`,
    ExpressionAttributeValues: {
      ...expressionAttributeValues,
      ":lastModified": new Date().toISOString(),
    },
    ExpressionAttributeNames: expressionAttributeNames,
    ReturnValues: "ALL_NEW",
  });

  try {
    const { Attributes } = await docClient.send(command);
    revalidatePath("/knowledge");
    return { success: true, data: Attributes as TResource };
  } catch (error) {
    return { success: false, error: "Failed to update resource" };
  }
}
