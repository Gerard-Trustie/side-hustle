"use server";

import { docClient } from "@/utils/dbConfig";
import { UpdateCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { TPost } from "@/constants/types";
import { updateAllUsersFeed } from "./updateAllUsersFeed";

export const publishAdminPost = async (inputPost: TPost) => {
  const { eventId: postId, userId } = inputPost;
  const underscoreIndex = postId.indexOf("_");
  const prefixType = postId.substring(0, underscoreIndex);
  const eventId = postId.substring(underscoreIndex + 1); //reference uuid without prefix

  const newDate = new Date().toISOString();
  console.log("🚀 ~ publishAdminPost ~ newPost:", inputPost);

  try {
    // Update post details
    const updateCommand = new UpdateCommand({
      TableName: process.env.AWS_TABLE_EVENT,
      Key: { eventId: postId, eventType: "post_detail" },
      UpdateExpression: "set lastStatus = :newStatus, updated = :newDate",
      ExpressionAttributeValues: {
        ":newStatus": "published",
        ":newDate": `${prefixType}_active_published_${newDate}`,
      },
      ReturnValues: "ALL_NEW",
    });

    const getnewPosts = await docClient.send(updateCommand);
    const newPost = getnewPosts.Attributes;

    if (userId !== newPost?.userId) {
      throw new Error("You do not have the right to publish");
    }

    // Create new chat
    const newChat = {
      eventId: `chat_${eventId}`,
      eventType: "chat_detail",
      userId: newPost.userId,
      forId: newPost.forId,
      created: newDate,
      updated: `chat_active_published_${newDate}`,
      title: newPost.title,
      description: newPost.description,
      pictures: newPost.pictures,
      picturePath: newPost.picturePath,
      preview: newPost.preview,
      privacy: newPost.privacy,
      lastStatus: "published",
      comments: 0,
      likes: 0,
      ...(prefixType === "goal" && {
        balance: 0,
        nbContribution: 0,
        value: newPost?.value,
        privacy: newPost.privacy,
      }),
    };

    // Create record with the new chat
    const putChatCommand = new PutCommand({
      TableName: process.env.AWS_TABLE_EVENT,
      Item: newChat,
    });
    await docClient.send(putChatCommand);

    // Update user status
    const updatePicture = newPost.pictures
      ? ", picture = :newPicture, preview = :newPreview, picturePath = :newPicturePath"
      : "";

    const UpdateExpression =
      prefixType === "goal"
        ? `set published = published + :one, updated = :newDate${updatePicture}`
        : `set written = written + :one, updated = :newDate${updatePicture}`;

    const ExpressionAttributeValues = newPost.pictures
      ? {
          ":one": 1,
          ":newDate": newDate,
          ":newPicture": newPost.pictures[0].split("#")[1] || "",
          ":newPreview": newPost.preview,
          ":newPicturePath": newPost.picturePath,
        }
      : { ":one": 1, ":newDate": newDate };

    const updateStatusCommand = new UpdateCommand({
      TableName: process.env.AWS_TABLE_USER,
      Key: { userId, primarySK: "post_status" },
      UpdateExpression,
      ExpressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });
    await docClient.send(updateStatusCommand);

    // Update feeds in the background
    const updateFeedsPromise = updateAllUsersFeed({
      newDate,
      newChatEventId: newChat.eventId,
      postUserId: newPost.userId,
    }).catch((error) => {
      // Log any errors that occur during the background process
      console.error("Error updating feeds in background:", error);
    });

    // Don't await the feed update, let it run in the background
    // Fire and forget pattern
    void updateFeedsPromise;

    return { success: true, data: newChat };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
};
