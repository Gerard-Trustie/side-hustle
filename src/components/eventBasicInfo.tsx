import { TPost } from '@types';
import Image from "next/image";

export const EventBasicInfo = ({
  eventInfo,
  size = "large",
}: {
  eventInfo: TPost;
  size: "small" | "large";
}) => {
  if (!eventInfo) return null;
  const { title, created, preview } = eventInfo || {};

  return (
    <div className={`flex items-center`}>
      {preview && (
        <Image
          src={preview}
          alt="User Avatar"
          width={size === "large" ? 16 : 6}
          height={size === "large" ? 16 : 6}
          className={`w-6 h-6 text-xs rounded-full ${
            size === "large" ? "mr-4" : "mr-2"
          }`}
        />
      )}
      <div>
        <span className={size === "large" ? "text-xl font-semibold" : ""}>
          {title}
        </span>
      </div>
    </div>
  );
};
