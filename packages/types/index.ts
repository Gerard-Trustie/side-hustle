export type TUserSetting = {
  KYC: number;
  deviceId: string;
  deviceName: string;
  notification: boolean[];
  privacyCont: number; //level of privacy for contribution 0,1,2
  privacyGoal: number; //level of privacy for goal publication 0,1,2
  pushToken: string;
  confirmation: boolean[];
  feature: boolean[];
  appTheme: number;
  appLevel: number;
};

export type TUser = {
  userId: string; //or userSub
  userName: string; //email or phone number
  email: string; //or username in cognito authentication
  emailVerified?: boolean; //cognito to check if email has been verified
  phoneNumber: string; //becareful in cognito this is stored has phone_number
  phoneNumberVerified?: boolean; //cognito to check
  givenName: string; //becarefl in cognito this is stored has given_name
  familyName: string; //becarefl in cognito this is stored has family_name
  birthdate: string;
  gender?: string;
  userRole: string; //becarefl in cognito this is stored has profile
  identityId?: string; //used to store in S3
  familyId: string; //becarefl in cognito this is stored has custom:familyId
  picture?: string | null;
  picturePath?: string | null;
  preview?: string | null; //base64 image of the profile picture
  city?: string;
  street?: string;
  postalCode?: string; //becarefl in cognito this is stored has custom:postalCode
  country?: string; //becarefl in cognito this is stored has custom:country
  nationality?: string; //becarefl in cognito this is stored has custom:nationality
  setting?: TUserSetting;
  currency: string; // default currency used in the app
  appLevel: number; //Application level from 0 to 20
  assistants?: gAssistants;
  externalUserId?: string; //external user from provider SaltEdge or other
  appTheme: number; // value 0 default, 1 dark, 2 light to override if need default behavior
  trustZ?: gExternalAccount;
  lastUsed?: string; //date of when user last used the app on this device
  firstUsed?: string; //date of when user first used the app on this device
};

export type TPost = {
  eventId: string;
  eventType: string;
  userId: string;
  forId: string;
  created: string;
  updated: string;
  title: string;
  description: string;
  picturePath: string;
  pictures: string[];
  preview: string;
  privacy: "public" | "private"; // Assuming 'public' and 'private' are the only options
  lastStatus: string;
  comments: number;
  likes: number;
  secret: boolean;
};

export type Maybe<T> = T | null;

export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  AWSDate: { input: string; output: string };
  AWSDateTime: { input: string; output: string };
  AWSEmail: { input: string; output: string };
  AWSIPAddress: { input: string; output: string };
  AWSJSON: { input: string; output: string };
  AWSPhone: { input: string; output: string };
  AWSTime: { input: string; output: string };
  AWSTimestamp: { input: number; output: number };
  AWSURL: { input: string; output: string };
};

export type gExternalAccount = {
  readonly __typename?: "GExternalAccount";
  readonly balance?: Maybe<Scalars["Float"]["output"]>;
  readonly connection_id?: Maybe<Scalars["String"]["output"]>;
  readonly created_at?: Maybe<Scalars["String"]["output"]>;
  readonly currency_code?: Maybe<Scalars["String"]["output"]>;
  readonly extra?: Maybe<gExternalAccountExtra>;
  readonly id?: Maybe<Scalars["String"]["output"]>;
  readonly name?: Maybe<Scalars["String"]["output"]>;
  readonly nature?: Maybe<Scalars["String"]["output"]>;
  readonly providerInfo?: Maybe<gProviderInfo>;
  readonly updated_at?: Maybe<Scalars["String"]["output"]>;
};

export type gExternalAccountExtra = {
  readonly __typename?: "GExternalAccountExtra";
  readonly account_name?: Maybe<Scalars["String"]["output"]>;
  readonly account_number?: Maybe<Scalars["String"]["output"]>;
  readonly available_amount?: Maybe<Scalars["Float"]["output"]>;
  readonly bban?: Maybe<Scalars["String"]["output"]>;
  readonly blocked_amount?: Maybe<Scalars["Float"]["output"]>;
  readonly card_type?: Maybe<Scalars["String"]["output"]>;
  readonly client_name?: Maybe<Scalars["String"]["output"]>;
  readonly closing_balance?: Maybe<Scalars["Float"]["output"]>;
  readonly credit_limit?: Maybe<Scalars["Float"]["output"]>;
  readonly current_date?: Maybe<Scalars["String"]["output"]>;
  readonly current_time?: Maybe<Scalars["String"]["output"]>;
  readonly iban?: Maybe<Scalars["String"]["output"]>;
  readonly next_payment_amount?: Maybe<Scalars["Float"]["output"]>;
  readonly next_payment_date?: Maybe<Scalars["String"]["output"]>;
  readonly sort_code?: Maybe<Scalars["String"]["output"]>;
  readonly status?: Maybe<Scalars["String"]["output"]>;
  readonly swift?: Maybe<Scalars["String"]["output"]>;
};

export type gProviderInfo = {
  readonly __typename?: "GProviderInfo";
  readonly countryCode: Scalars["String"]["output"];
  readonly homeUrl: Scalars["String"]["output"];
  readonly loginUrl: Scalars["String"]["output"];
  readonly logoUrl: Scalars["String"]["output"];
  readonly providerName: Scalars["String"]["output"];
  readonly providerStatus: Scalars["String"]["output"];
};

export type gAssistants = {
  readonly __typename?: "GAssistants";
  readonly adviser: TUser;
  readonly analysis?: Maybe<Scalars["String"]["output"]>;
  readonly default: Scalars["String"]["output"];
  readonly pocketFileId?: Maybe<Scalars["String"]["output"]>;
  readonly transFileId?: Maybe<Scalars["String"]["output"]>;
};
