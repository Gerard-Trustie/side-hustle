"use server";

import { docClient } from "@/utils/dbConfig";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { randomUUID } from "crypto";

type TPostInput = {
  userId: string;
  title: string;
  description: string;
  image: string;
};

async function uploadImageToS3(
  imageBuffer: Buffer,
  fileName: string
): Promise<string> {
  const s3Client = new S3Client({ region: process.env.AWS_REGION! });
  const key = `protected/eu-west-1:admin/${fileName}`;
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_USER_FILES_S3_BUCKET,
    Key: key,
    Body: imageBuffer,
  });
  console.log("🚀 ~ uploadImageToS3 ~ command:");
  await s3Client.send(command);
  console.log("🚀 ~ uploadImageToS3 ~ success:");
  return `https://${process.env.AWS_USER_FILES_S3_BUCKET}.s3.amazonaws.com/${key}`;
}

async function processAndUploadImage(
  imageBuffer: Buffer,
  userId: string
): Promise<{
  lowResFileName: string;
  highResFileName: string;
  preview: string;
}> {
  const lowResBuffer = await sharp(imageBuffer).resize(100).toBuffer();
  console.log("🚀 ~ processAndUploadImage ~ lowResBuffer:");
  const highResBuffer = await sharp(imageBuffer).resize(800).toBuffer();
  console.log("🚀 ~ processAndUploadImage ~ highResBuffer:");
  const previewBuffer = await sharp(imageBuffer).resize(50).toBuffer();
  console.log("🚀 ~ processAndUploadImage ~ previewBuffer:");

  const timestamp = Date.now();
  const lowResFileName = `${userId}_low_${timestamp}.jpg`;
  const highResFileName = `${userId}_high_${timestamp}.jpg`;

  const [lowResUrl, highResUrl] = await Promise.all([
    uploadImageToS3(lowResBuffer, lowResFileName),
    uploadImageToS3(highResBuffer, highResFileName),
  ]);

  const preview = `data:image/jpeg;base64,${previewBuffer.toString("base64")}`;

  return { lowResFileName, highResFileName, preview };
}

export const createAdminPost = async (post: TPostInput) => {
  const { userId, title, description, image } = post;
  console.log(
    "🚀 ~ createAdminPost ~ { userId, title, description, image } :",
    { userId, title, description, image }
  );
  const newDate = new Date().toISOString();

  // Process and upload the image
  const imageBuffer = Buffer.from(image, "base64");
  console.log("🚀 ~ createAdminPost ~ imageBuffer:");

  const { highResFileName, preview } = await processAndUploadImage(
    imageBuffer,
    userId
  );
  const eventId = "flash_" + randomUUID();

  const newPostDetail = {
    eventId,
    eventType: "post_detail",
    userId,
    forId: userId,
    created: newDate,
    updated: "flash_active_created_" + newDate,
    title,
    description,
    picturePath: "eu-west-1:admin",
    pictures: ["0#" + highResFileName],
    preview,
    privacy: "public", // Assuming a default value
    lastStatus: "created",
    comments: 0,
    likes: 0,
    secret: false,
  };
  console.log("🚀 ~ createAdminPost ~ newPostDetail:", newPostDetail);

  try {
    const command = new PutCommand({
      TableName: process.env.AWS_TABLE_EVENT,
      Item: newPostDetail,
    });
    await docClient.send(command);
    return {
      success: true,
      eventId: newPostDetail.eventId,
      eventType: newPostDetail.eventType,
    };
  } catch (err) {
    console.error(err);
    return { error: err };
  }
};
