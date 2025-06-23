#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { HustleHubDatabaseStack } from './hustle-hub-table';

const app = new cdk.App();

new HustleHubDatabaseStack(app, 'HustleHubDatabaseStack', {
  // Configure environment - update these values for your AWS account
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },

  // Add stack description
  description: 'DynamoDB table and GSIs for Hustle Hub directory application',

  // Add tags for resource management
  tags: {
    Project: 'HustleHub',
    Environment: process.env.ENVIRONMENT || 'development',
    Component: 'Database',
  },
});
