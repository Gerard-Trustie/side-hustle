"use server";

import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { docClient } from "@/utils/dbConfig";
import { PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { TResource } from "@/app/(auth)/knowledge/knowledge.types";

export async function getS3ImageUrl(picturePath: string, pictureName: string) {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
  });
  const Key = `protected/${picturePath}/${pictureName}`;
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_USER_FILES_S3_BUCKET,
    Key,
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    console.log("🚀 ~ signedUrl:", signedUrl);
    return signedUrl;
  } catch (error) {
    console.error("Error generating S3 pre-signed URL:", error);
    throw new Error("Failed to generate image URL");
  }
}

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

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

export async function uploadKnowledgeFileToS3(file: File) {
  "use server";
  const fileName = `${Date.now()}-${file.name}`;
  const Key = `protected/eu-west-1:knowledge/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_KNOWLEDGE!,
    Key,
  });

  try {
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    // Upload the file using the signed URL
    await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    // Return the permanent URL of the uploaded file
    return `${process.env.S3_BUCKET_KNOWLEDGE_URL}/${fileName}`;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file to S3");
  }
}
