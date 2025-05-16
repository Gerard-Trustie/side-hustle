"server only";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, TranslateConfig } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION! });

const marshallOptions: TranslateConfig["marshallOptions"] = {
  convertEmptyValues: false,
  removeUndefinedValues: true,
  convertClassInstanceToMap: false,
};

const unmarshallOptions: TranslateConfig["unmarshallOptions"] = {
  wrapNumbers: false,
};

const translateConfig: TranslateConfig = {
  marshallOptions,
  unmarshallOptions,
};

const docClient = DynamoDBDocumentClient.from(ddbClient, translateConfig);

export { docClient };
