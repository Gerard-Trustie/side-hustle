import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export class HustleHubDatabaseStack extends cdk.Stack {
  public readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const environment = process.env.ENVIRONMENT || "development";
    const isProd = environment === "production";

    // Main DynamoDB table for Hustle Hub Directory
    this.table = new dynamodb.Table(this, "HustleHubDirectory", {
      tableName: `HustleHubDirectory-${environment}`,

      // Primary Key Structure
      partitionKey: {
        name: "PK",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "SK",
        type: dynamodb.AttributeType.STRING,
      },

      // Billing Configuration
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,

      // Data Protection
      pointInTimeRecovery: isProd,
      deletionProtection: isProd,

      // Encryption
      encryption: dynamodb.TableEncryption.AWS_MANAGED,

      // Backup Configuration
      ...(isProd && {
        backupProps: {
          backupPolicy: dynamodb.BackupPolicy.WEEKLY,
          deleteBackupsAfterDays: 30,
        },
      }),

      // Tags
      tags: {
        Project: "HustleHub",
        Environment: environment,
        Component: "Database",
      },

      // Stream Configuration for future real-time features
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
    });

    // GSI1: User Email Lookup
    this.table.addGlobalSecondaryIndex({
      indexName: "GSI1-UserEmailIndex",
      partitionKey: {
        name: "GSI1PK",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "GSI1SK",
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.KEYS_ONLY,
    });

    // GSI2: Listings by Creation Date
    this.table.addGlobalSecondaryIndex({
      indexName: "GSI2-ListingsByDateIndex",
      partitionKey: {
        name: "GSI2PK",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "GSI2SK",
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.INCLUDE,
      nonKeyAttributes: [
        "listingId",
        "slug",
        "title",
        "categoryName",
        "categorySlug",
        "primaryAttributes",
        "earnings",
        "requirements",
        "filterValues",
        "imageUrl",
        "verified",
        "verificationLevel",
        "isActive",
        "createdAt",
        "analytics",
        "tags",
        "rating",
        "keywords",
        "externalUrls",
        "metaData",
        "schemaOrg",
      ],
    });

    // GSI3: Admin Management
    this.table.addGlobalSecondaryIndex({
      indexName: "GSI3-AdminManagementIndex",
      partitionKey: {
        name: "GSI3PK",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "GSI3SK",
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.INCLUDE,
      nonKeyAttributes: [
        "userId",
        "email",
        "role",
        "adminCreatedAt",
        "adminCreatedBy",
      ],
    });

    // GSI4: Category and Listing Slug Lookup
    this.table.addGlobalSecondaryIndex({
      indexName: "GSI4-SlugLookupIndex",
      partitionKey: {
        name: "GSI4PK",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "GSI4SK",
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.KEYS_ONLY,
    });

    // CloudWatch Alarms for Production
    if (isProd) {
      // Read Throttle Alarm
      new cdk.aws_cloudwatch.Alarm(this, "ReadThrottleAlarm", {
        metric: this.table.metricUserErrors({
          dimensionsMap: {
            Operation: "GetItem",
          },
        }),
        threshold: 5,
        evaluationPeriods: 2,
        treatMissingData: cdk.aws_cloudwatch.TreatMissingData.NOT_BREACHING,
      });

      // Write Throttle Alarm
      new cdk.aws_cloudwatch.Alarm(this, "WriteThrottleAlarm", {
        metric: this.table.metricUserErrors({
          dimensionsMap: {
            Operation: "PutItem",
          },
        }),
        threshold: 5,
        evaluationPeriods: 2,
        treatMissingData: cdk.aws_cloudwatch.TreatMissingData.NOT_BREACHING,
      });
    }

    // IAM Role for Application Access
    const applicationRole = new iam.Role(this, "HustleHubApplicationRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      description: "Role for Hustle Hub application to access DynamoDB",
    });

    // Grant read/write permissions to the application role
    this.table.grantReadWriteData(applicationRole);

    // IAM Role for Admin Operations
    const adminRole = new iam.Role(this, "HustleHubAdminRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      description: "Role for Hustle Hub admin operations",
    });

    // Grant full access to admin role
    this.table.grantFullAccess(adminRole);

    // Output important values
    new cdk.CfnOutput(this, "TableName", {
      value: this.table.tableName,
      description: "DynamoDB table name",
      exportName: `HustleHub-TableName-${environment}`,
    });

    new cdk.CfnOutput(this, "TableArn", {
      value: this.table.tableArn,
      description: "DynamoDB table ARN",
      exportName: `HustleHub-TableArn-${environment}`,
    });

    new cdk.CfnOutput(this, "ApplicationRoleArn", {
      value: applicationRole.roleArn,
      description: "Application access role ARN",
      exportName: `HustleHub-AppRoleArn-${environment}`,
    });

    new cdk.CfnOutput(this, "AdminRoleArn", {
      value: adminRole.roleArn,
      description: "Admin access role ARN",
      exportName: `HustleHub-AdminRoleArn-${environment}`,
    });
  }
}
