import { TUser } from "@/constants/types";
import Image from "next/image";

export const UserBasicInfo = ({
  basicProfile,
  size = "large",
}: {
  basicProfile: TUser;
  size: "small" | "large";
}) => {
  if (!basicProfile) return null;
  const { givenName, familyName, preview, userId } = basicProfile || {};

  const initials = `${givenName?.[0] || ""}${
    familyName?.[0] || ""
  }`.toUpperCase();

  const sizeClasses =
    size === "small" ? "w-6 h-6 text-xs" : "w-16 h-16 text-xl";

  return (
    <div className={`flex items-center ${size === "large" ? "mb-6" : ""}`}>
      {preview ? (
        <Image
          src={preview}
          alt="User Avatar"
          width={size === "large" ? 16 : 6}
          height={size === "large" ? 16 : 6}
          className={`${sizeClasses} rounded-full ${
            size === "large" ? "mr-4" : "mr-2"
          }`}
        />
      ) : (
        <div
          className={`${sizeClasses} rounded-full ${
            size === "large" ? "mr-4" : "mr-2"
          } bg-primary-500 flex items-center justify-center text-white font-semibold`}
        >
          {initials}
        </div>
      )}
      <div>
        <span
          className={size === "large" ? "text-xl font-semibold" : ""}
        >{`${givenName} ${familyName}`}</span>
      </div>
    </div>
  );
};
