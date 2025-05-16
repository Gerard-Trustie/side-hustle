"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import phoneFrame from "@/assets/phone_frame.png";
import { getEventById } from "@/actions/getEventById";
import { getUserBasicProfile } from "@/actions/getUserBasicProfile";
import { getS3ImageUrl } from "@/actions/s3Actions";
import { publishAdminPost } from "@/actions/publishAdminPost";
import { getOrderedPictures } from "@utils/objectUtils";
import { Button } from "@/components/ui/button";

import AnimatedSpinner from "@/components/AnimatedSpinner";
import SelectTrustie from "@/components/SelectUser";
import SelectPost from "@/components/SelectPost";
import { TPost } from "@/constants/types";

interface PostData {
  userId: string;
  title: string;
  description: string;
  image: string;
  preview: string;
  created: string;
  picturePath: string;
  pictureName: string;
  lastStatus?: string;
}

interface UserProfile {
  name: string;
  avatar: string;
}

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime);

const PreviewPost: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [postData, setPostData] = useState<PostData | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const searchParams = useSearchParams();
  const [highResImageLoaded, setHighResImageLoaded] = useState(false);
  const [highResImageUrl, setHighResImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const eventIdParam = searchParams.get("eventId");
  const eventTypeParam = searchParams.get("eventType");
  const adminId = searchParams.get("userId");
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    console.log(eventIdParam, eventTypeParam, adminId);
    if (eventIdParam === "null" && eventTypeParam === "null") {
      setIsLoading(false);
      return;
    }
    if (eventIdParam && eventTypeParam && adminId) {
      Promise.all([
        getEventById(eventIdParam, eventTypeParam),
        getUserBasicProfile(adminId),
      ]).then(([eventData, userData]) => {
        if (eventData) {
          setPostData(eventData);
        }

        if (userData) {
          setUserProfile(userData);
        }
        setIsLoading(false);
      });
    }
  }, [eventIdParam, eventTypeParam, adminId]);

  useEffect(() => {
    if (postData?.picturePath && postData.pictures) {
      getS3ImageUrl(
        postData.picturePath,
        getOrderedPictures(postData.pictures)[0]
      ).then((url) => setHighResImageUrl(url));
    }
  }, [postData]);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const searchTerm = formData.get("searchTerm")?.toString();
    console.log("🚀 ~ handleSearch ~ searchTerm:", searchTerm);

    if (!searchTerm) {
      setIsLoading(false);
      return;
    }
    params.delete("eventId");
    params.delete("eventType");
    replace(`${pathname}?${params.toString()}`);
    console.log("🚀 ~ Publish post handleSearch ~ params reset");
    setSearchTerm(searchTerm);
  };

  //case where there is no eventId or userId
  //search based on eventid or title or description of the post
  if (!adminId || !eventIdParam || eventIdParam === "null") {
    return (
      <div className="flex flex-col max-w-5xl w-full ">
        <SelectTrustie
          searchTitle="Select Trustie Mentor"
          searchTerm="Trustie"
          showUserInfo={true}
        />
        <label
          htmlFor="userId"
          className={`block text-sm font-semibold text-gray-700 mb-2 ${
            !adminId ? "opacity-50" : ""
          }`}
        >
          Enter search term for post
        </label>
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex w-full ">
            <input
              id="searchTerm"
              name="searchTerm"
              type="text"
              className="flex-grow rounded-l-md border border-gray-300 shadow-sm focus:border-primary500 focus:ring-primary500 focus:ring-opacity-50 focus:outline-none pl-3"
              placeholder="Enter post title or id or #tags..."
              required
              disabled={isLoading || !adminId}
            />
            <Button
              type="submit"
              className="bg-primary-500 text-white py-2 px-4 rounded-none rounded-r-md hover:bg-primary600 focus:outline-none focus:ring-2 focus:ring-primary500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !adminId}
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </form>
        <SelectPost
          searchTitle="Select Post"
          searchTerm={searchTerm}
          userId={adminId}
          onSearchComplete={() => {
            setIsLoading(false);
          }}
        />
      </div>
    );
  }

  if (!postData || !userProfile) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[90vh] max-w-[90%]">
        <AnimatedSpinner size={60} isCircle={false} />
      </div>
    );
  }

  const isInstaPublished = postData?.lastStatus?.includes("Insta");
  const isTrustiePublished = postData?.lastStatus?.includes("Trustie");

  console.log("🚀 ~ ]).then ~ eventData:", postData);

  const handleSubmit = async (publishType: "Trustie" | "Insta" | "Both") => {
    setIsSubmitting(true);
    try {
      // TODO: Implement the actual publish logic here
      console.log(`Publishing to ${publishType}`);
      switch (publishType) {
        case "Trustie":
          await publishAdminPost(postData as Partial<TPost>);
          break;
      }
      // Simulating an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(`Successfully published to ${publishType}`);
    } catch (error) {
      console.error(`Error publishing to ${publishType}:`, error);
      alert(`Failed to publish to ${publishType}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      {/* Phone preview container - add relative positioning */}
      <div className="relative w-[375px] h-[812px] mt-[-90px] overflow-hidden">
        {/* Phone frame - add z-index */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-[1]">
          <Image
            src={phoneFrame}
            alt="Phone frame"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
        {/* Rest of phone content */}
        <div className="absolute top-[130px] left-[50px] right-[50px] bg-white z-[2]">
          {/* User info and post date */}
          <div className="p-2 flex items-center border-b border-gray-300">
            <Image
              src={userProfile.preview}
              alt="User avatar"
              width={40}
              height={40}
              className="rounded-full mr-3 shadow-md"
            />
            <div>
              <h3 className="font-bold text-sm">
                {userProfile.givenName} {userProfile.familyName}
              </h3>
              <p className="text-xs text-gray-500">
                {dayjs(postData.updated.split("_").pop()).fromNow()}
              </p>
            </div>
          </div>

          {/* Post image with preview and high-res version */}
          <div className="relative w-full h-[300px] overflow-hidden rounded-lg mt-2">
            {postData.preview && (
              <Image
                src={postData.preview}
                alt="Post preview"
                layout="fill"
                objectFit="cover"
                className={`transition-opacity duration-300 ${
                  highResImageLoaded ? "opacity-0" : "opacity-100"
                }`}
                style={{ filter: "blur(10px)" }}
              />
            )}
            {highResImageUrl && (
              <Image
                src={highResImageUrl}
                alt="Post image"
                layout="fill"
                objectFit="cover"
                onLoad={() => setHighResImageLoaded(true)}
                className={`transition-opacity duration-300 ${
                  highResImageLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            )}
          </div>
          {/* Post title */}
          <div className="p-2 ">
            <h2 className="font-bold">{postData.title}</h2>
          </div>
          <div className="px-2">
            <p className="text-sm">{postData.description}</p>
          </div>
        </div>
      </div>
      {/* Buttons container - add z-index */}
      <div className="flex flex-row mt-[-30px] space-x-10 w-full justify-center items-center z-[2]">
        <Button
          disabled={isTrustiePublished || isSubmitting}
          onClick={() => handleSubmit("Trustie")}
        >
          Publish Trustie
        </Button>
        <Button
          disabled={isInstaPublished || isSubmitting}
          onClick={() => handleSubmit("Insta")}
        >
          Publish Insta
        </Button>
        <Button
          disabled={isInstaPublished || isTrustiePublished || isSubmitting}
          onClick={() => handleSubmit("Both")}
        >
          Publish Both
        </Button>
      </div>
    </div>
  );
};

export default PreviewPost;
