export enum ResourceType {
  APP_OR_TOOL = "📱  App or Tool",
  ARTICLE = "📰  Article",
  BLOG = "💬  Blog",
  BOOK = "📚  Book",
  COURSE = "🎓  Course",
  OTHER = "🔍  Other",
  PODCAST = "🎧  Podcast",
  SOCIAL = "👥  Social",
  VIDEO = "🎥  Video",
  WEBSITE = "🌐  Website",
}

export enum ResourceStatus {
  IDENTIFIED = "🚩  Identified",
  PURCHASED = "🛒  Purchased",
  DOWNLOADED = "📥  Downloaded",
  CONTENT_REVIEW = "✍️  Content Reviewed",
  TAGGED = "🏷️  Tagged and Curated",
  DATABASE = "🗄️  Database ingested",
}

export type TTag = {
  tagId: string;
  name: string;
  createdAt?: Date;
};

export interface TResource {
  resourceId: string;
  SK: string;
  title: string;
  url: string;
  author?: string;
  type: ResourceType;
  notes?: string;
  tags: TTag[];
  status: ResourceStatus;
  createdAt: string;
  updatedAt: string;
}

export const RESOURCE_TYPES = [
  ResourceType.APP_OR_TOOL,
  ResourceType.ARTICLE,
  ResourceType.BLOG,
  ResourceType.BOOK,
  ResourceType.COURSE,
  ResourceType.OTHER,
  ResourceType.PODCAST,
  ResourceType.SOCIAL,
  ResourceType.VIDEO,
  ResourceType.WEBSITE,
];

export const RESOURCE_STATUSES = [
  ResourceStatus.IDENTIFIED,
  ResourceStatus.PURCHASED,
  ResourceStatus.DOWNLOADED,
  ResourceStatus.CONTENT_REVIEW,
  ResourceStatus.TAGGED,
  ResourceStatus.DATABASE,
];

// export const RESOURCE_TYPES = [
//   "Article",
//   "Book",
//   "Video",
//   "Podcast",
//   "Course",
//   "Tool",
//   "Other",
// ];

// export const RESOURCE_STATUS = [
//   "To Review",
//   "In Progress",
//   "Completed",
//   "Archived",
// ];

export const DEFAULT_TAGS: TTag[] = [
  { tagId: "1", name: "Investing" },
  { tagId: "2", name: "Savings" },
  { tagId: "3", name: "Credit" },
  { tagId: "4", name: "Taxes" },
  { tagId: "5", name: "Insurance" },
  { tagId: "6", name: "Retirement" },
  { tagId: "7", name: "Real Estate" },
];
