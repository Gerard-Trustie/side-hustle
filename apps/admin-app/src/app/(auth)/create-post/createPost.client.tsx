"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SelectUser from '@components/SelectUser';
import { createAdminPost } from "@/actions/createAdminPost";
import Image from "next/image";
import { Button } from '@components/ui/button';

// New component for file preview
const FilePreview: React.FC<{ file: File | null }> = ({ file }) => {
  if (!file) return null;

  const isImage = file.type.startsWith("image/");

  return (
    <div className="mt-2">
      {isImage ? (
        <Image
          src={URL.createObjectURL(file)}
          alt="Selected image"
          width={200}
          height={200}
          className="object-cover rounded-md"
        />
      ) : (
        <p className="text-sm text-gray-600">{file.name}</p>
      )}
    </div>
  );
};

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  console.log("🚀 ~ searchParams:", searchParams);
  const selectedUserId = searchParams.get("userId");
  const { push } = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostLoading(true);
    setPostError(null);

    try {
      if (!selectedUserId || !image) {
        throw new Error("Missing required fields");
      }

      // Convert image to base64 string
      const imageBase64 = await convertFileToBase64(image);

      // Create TPost object
      const postData = {
        userId: selectedUserId,
        title,
        description,
        image: imageBase64,
      };

      const result = await createAdminPost(postData);

      if (result.success) {
        // Redirect to the preview page with the new post data
        const params = new URLSearchParams(searchParams);
        params.set("eventId", result.eventId);
        params.set("eventType", result.eventType);
        push(`/publish-post?${params.toString()}`);
      } else {
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "Failed to create post"
        );
      }
    } catch (error) {
      setPostError(error instanceof Error ? error.message : String(error));
    } finally {
      setPostLoading(false);
    }
  };

  // Helper function to convert File to base64 string
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        const buffer = Buffer.from(reader.result as ArrayBuffer);
        resolve(buffer.toString("base64"));
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const isFormValid = title && description && image && selectedUserId;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <SelectUser
        searchTitle="Select Trustie Mentor"
        searchTerm="Trustie"
        showUserInfo={true}
      />
      <div className="space-y-6 w-full">
        <div className="w-full">
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-primary500 focus:ring-primary500 focus:ring-opacity-50 focus:outline-none pl-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="w-full">
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-primary500 focus:ring-primary500 focus:ring-opacity-50 focus:outline-none py-2 px-3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
      </div>
      <div className="mt-6">
        <label
          htmlFor="image"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Image
        </label>
        <input
          type="file"
          id="image"
          className="w-full"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          required
        />
        <FilePreview file={image} />
      </div>
      <div className="mt-6">
        <Button
          type="submit"
          className="w-full"
          disabled={postLoading || !isFormValid}
        >
          {postLoading ? "Creating..." : "Create Post"}
        </Button>
      </div>
      {postError && (
        <p className="mt-4 text-red-600">Error creating post: {postError}</p>
      )}
    </form>
  );
};

export default CreatePost;
