# Hustle Hub AWS Migration - DynamoDB Infrastructure

This directory contains the AWS CDK infrastructure code for migrating the Hustle Hub application from Supabase to AWS DynamoDB, implementing the enhanced data models and architecture defined in the updated PRD.

## Overview

The infrastructure creates a single DynamoDB table with multiple Global Secondary Indexes (GSIs) to support all the access patterns required by the Hustle Hub directory application. The design aligns with the comprehensive feature set defined in the updated PRD, including rich listing metadata, enhanced user profiles, community features, and powerful filtering capabilities.

## Files Structure

```
setup-dynamoDB/
├── README.md                    # This file
├── package.json                 # Node.js dependencies
├── tsconfig.json               # TypeScript configuration
├── cdk.json                    # CDK configuration
├── app.ts                      # CDK app entry point
├── hustle-hub-table.ts         # DynamoDB table and GSI definitions (CDK implementation)
├── dynamodb-gsi-design.md      # Detailed GSI documentation
├── dynamoDB_table_design.md    # Enhanced single-table design
└── dynamoDB-design.md          # Implementation strategy and guidelines
```

## Key Features Supported

### Enhanced Data Models (Aligned with PRD)
- **Rich Listing Metadata**: Earnings, requirements, filter values, analytics, SEO data
- **User Personalization**: Enhanced profiles with preferences, skills, interests
- **Comprehensive Filtering**: Cross-category filter system for powerful discovery
- **Community Ready**: Schema supports reviews, ratings, and social features
- **SEO Optimized**: Structured data and metadata for search engine optimization

### 5-Category Structure (PRD-Aligned)
1. **Create & Sell** 🎨 - Handmade goods, digital products, reselling
2. **Offer Your Skills** 💼 - Freelancing, tutoring, creative services  
3. **Share & Rent Your Assets** 🏠 - Airbnb, car sharing, equipment rental
4. **Local Tasks & Services** 📍 - Delivery, pet care, home services
5. **Online Tasks & Content** 💻 - Surveys, content creation, affiliate marketing

### Advanced Capabilities
- **Analytics Integration**: Built-in view, save, share, and click tracking
- **Admin Dashboard**: Enhanced admin management with user insights
- **Slug-Based Routing**: Fast URL routing for SEO optimization
- **Verification System**: Multi-level content verification (manual, platform, user-submitted)

## Prerequisites

Before deploying, ensure you have:

1. **AWS CLI configured** with appropriate credentials

   ```bash
   aws configure
   ```

2. **Node.js 18+** installed

   ```bash
   node --version
   ```

3. **AWS CDK CLI** installed globally

   ```bash
   npm install -g aws-cdk
   ```

4. **CDK bootstrapped** in your target region (one-time setup)
   ```bash
   cdk bootstrap
   ```

## Quick Start

### 1. Install Dependencies

```bash
cd setup-dynamoDB
npm install
```

### 2. Review Configuration

Edit `app.ts` to set your target AWS account and region:

```typescript
env: {
  account: 'YOUR_AWS_ACCOUNT_ID',  // or process.env.CDK_DEFAULT_ACCOUNT
  region: 'us-east-1',             // or process.env.CDK_DEFAULT_REGION
}
```

### 3. Preview Changes

```bash
npm run synth  # Generate CloudFormation template
npm run diff   # Show what will be deployed
```

### 4. Deploy Infrastructure

```bash
npm run deploy
```

This will create:

- DynamoDB table: `HustleHubDirectory-{environment}`
- 4 Global Secondary Indexes (enhanced projections)
- IAM roles and policies (application and admin)
- CloudWatch alarms (production environments)
- Cost monitoring and optimization features

### 5. Verify Deployment

After deployment, you can verify the table exists:

```bash
aws dynamodb describe-table --table-name HustleHubDirectory-development
```

## Enhanced Table Design

### Main Table

- **Name**: `HustleHubDirectory-{environment}`
- **Primary Key**: `PK` (Partition Key) + `SK` (Sort Key)
- **Billing**: Pay-per-request (on-demand)
- **Features**: Point-in-time recovery, encryption at rest, streams enabled

### Global Secondary Indexes (Enhanced)

| Index | Purpose           | Partition Key | Sort Key | Projection |
| ----- | ----------------- | ------------- | -------- | ---------- |
| GSI1  | User email lookup | `GSI1PK`      | `GSI1SK` | KEYS_ONLY |
| GSI2  | Listings by date (enhanced) | `GSI2PK`      | `GSI2SK` | INCLUDE (comprehensive) |
| GSI3  | Admin management (enhanced) | `GSI3PK`      | `GSI3SK` | INCLUDE (user data) |
| GSI4  | Slug lookup (enhanced) | `GSI4PK`      | `GSI4SK` | INCLUDE (validation) |

## Enhanced Entity Types

The single table stores multiple entity types with rich metadata:

### User Entities
- **User Profiles**: Enhanced with preferences, skills, interests, location
- **Admin Roles**: Role-based access with audit trails
- **Favourites**: User's saved listings with category organization

### Content Entities  
- **Categories**: 5-category structure with comprehensive filter definitions
- **Listings**: Rich metadata including earnings, requirements, analytics
- **Slug Mappings**: Fast URL routing with entity type validation

### Analytics & SEO
- **Analytics Data**: Views, saves, shares, clicks tracked per listing
- **SEO Metadata**: Titles, descriptions, structured data for search engines
- **Verification**: Multi-level verification system for content trust

## Access Patterns (PRD-Aligned)

### Core Operations

✅ **Enhanced User Management**
- Get user with preferences and personalization data
- User lookup by email with full profile
- Admin role management with audit trails

✅ **Rich Category Operations**
- List categories with filter definitions and metadata
- Get category with comprehensive filter options
- Admin CRUD with SEO and analytics data

✅ **Advanced Listing Operations**
- Get listings with earnings, requirements, filter values
- Category-based browsing with client-side filtering
- Trending/popular listings based on analytics
- Verified content prioritization

✅ **Enhanced Favourites**
- Save/unsave with category organization
- Favourites dashboard with rich metadata
- Analytics on favourite patterns

✅ **SEO & Performance**
- Fast slug-based routing for categories and listings
- Structured data for search engine optimization
- Analytics tracking for content optimization

## Environment Configuration

### Development

```bash
ENVIRONMENT=development npm run deploy
```

Creates table: `HustleHubDirectory-development`

### Production

```bash
ENVIRONMENT=production npm run deploy
```

Production deployment includes:
- Point-in-time recovery enabled
- Enhanced monitoring and alerting
- Backup retention policies
- Cost optimization features

## Data Migration Strategy

### Phase 1: Enhanced Schema Migration

1. **Export Enhanced Data** from existing sources
2. **Transform to Rich Format** using migration scripts
3. **Validate Data Integrity** with comprehensive checks
4. **Batch Import** with error handling and rollback

### Example Enhanced Transformation

```typescript
// Transform basic listing to enhanced DynamoDB format
function transformListing(basicListing: any) {
  return {
    PK: `LISTING#${basicListing.slug}`,
    SK: `METADATA#${basicListing.slug}`,
    type: 'Listing',
    
    // Basic data
    slug: basicListing.slug,
    title: basicListing.title,
    description: basicListing.description,
    category: mapToNewCategory(basicListing.category),
    
    // Enhanced attributes from listing-attributes.json
    primaryAttributes: {
      skillLevel: mapSkillLevel(basicListing.skills),
      timeCommitment: categorizeTimeCommitment(basicListing.min_hours, basicListing.max_hours),
      upfrontCost: categorizeCost(basicListing.startup_cost),
      incomePotential: categorizeIncome(basicListing.max_income),
      locationType: basicListing.location_type || 'Online',
      platformRequired: basicListing.platform
    },
    
    secondaryAttributes: {
      deviceNeeded: basicListing.device_requirements || 'Computer recommended',
      assetsNeeded: basicListing.assets_needed || 'Basic setup',
      interests: mapInterests(basicListing.tags),
      riskLevel: categorizeRisk(basicListing.startup_cost),
      gettingPaidSpeed: mapPaymentSpeed(basicListing.payment_frequency),
      flexibility: 'Fully Flexible'
    },
    
    tags: basicListing.tags || [],
    rating: calculateRating(basicListing),
    keywords: generateKeywords(basicListing.title, basicListing.description, basicListing.tags),
    
    // Enhanced PRD data
    earnings: {
      min: basicListing.min_income || 0,
      max: basicListing.max_income || 1000,
      type: 'monthly',
      disclaimer: 'Earnings vary based on effort and market conditions'
    },
    
    requirements: {
      skills: parseSkills(basicListing.skills),
      equipment: parseEquipment(basicListing.equipment),
      startupCost: basicListing.startup_cost || 0,
      timeCommitment: {
        min: basicListing.min_hours || 1,
        max: basicListing.max_hours || 40,
        flexibility: 'high'
      }
    },
    
    filterValues: {
      location: basicListing.location_type || 'online',
      platform: [basicListing.platform],
      skillsRequired: parseSkills(basicListing.skills),
      incomePotential: categorizeIncome(basicListing.max_income),
      startupCost: categorizeCost(basicListing.startup_cost),
      interests: mapInterests(basicListing.tags)
    },
    
    externalUrls: {
      primary: basicListing.signup_url,
      additional: basicListing.learn_more_urls || [],
      tutorial: basicListing.tutorial_url
    },
    
    sourceUrls: basicListing.source_urls || [],
    
    metaData: {
      seoTitle: generateSEOTitle(basicListing.title),
      seoDescription: generateSEODescription(basicListing.description),
      type: 'Active',
      monetizationType: determineMonetizationType(basicListing.category),
      engagementMode: 'Solo'
    },
    
    // Schema.org structured data (optional - can be generated from templates)
    schemaOrg: generateSchemaOrg(basicListing, categoryDefaults),
    
    // Analytics (start with zeros)
    analytics: {
      views: 0,
      saves: 0,
      shares: 0,
      clicks: 0
    },
    
    // AI/ML features
    embeddingVector: [], // Will be generated by ML pipeline
    
    verified: true,
    verificationLevel: 'manual',
    isActive: true,
    lastCheckedAt: new Date().toISOString(),
    curatedBy: 'Admin',
    createdAt: new Date().toISOString(),
    
    // GSI attributes
    GSI2PK: 'LISTINGS',
    GSI2SK: `CREATED#${new Date().toISOString()}#${basicListing.slug}`
  };
}

// Helper function to generate schema.org structured data
function generateSchemaOrg(listing: any, categoryDefaults: any) {
  // Use custom schemaOrg if provided, otherwise generate from template
  if (listing.schemaOrg) {
    return listing.schemaOrg;
  }
  
  // Generate from template using category defaults and listing data
  const schemaType = categoryDefaults.schemaType || 'Service';
  
  return {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: listing.title,
    description: listing.description,
    url: `https://hustlehub.uk/listings/${listing.slug}`,
    areaServed: 'United Kingdom',
    ...(listing.platform && {
      provider: {
        '@type': 'Organization',
        name: listing.platform
      }
    }),
    ...(listing.min_income && listing.max_income && {
      offers: {
        '@type': 'Offer',
        priceRange: `£${listing.min_income}-£${listing.max_income}`,
        priceCurrency: 'GBP'
      }
    })
  };
}
```

## Monitoring & Analytics

### Enhanced CloudWatch Metrics

Monitor these key metrics for the comprehensive feature set:

- **Performance Metrics**
  - Read/Write capacity consumption per GSI
  - Query latency percentiles (P50, P95, P99)
  - Error rates by operation type

- **Business Metrics**
  - Listing view/save/share rates
  - User engagement patterns
  - Category popularity trends
  - Conversion funnel analytics

- **Cost Metrics**
  - GSI storage costs (especially GSI2 with comprehensive projections)
  - Request costs by access pattern
  - Data transfer costs

### Cost Monitoring (Updated Estimates)

```bash
# Enhanced cost structure for rich data models
# Base table: ~$15-25/month (enhanced schemas)
# GSI1 (User lookup): ~$5/month
# GSI2 (Listings enhanced): ~$30-40/month (comprehensive projections including schemaOrg)
# GSI3 (Admin enhanced): ~$3/month  
# GSI4 (Slug lookup): ~$4/month
# Total estimated: ~$55-75/month for 1k listings, 100k users
```

## Development Workflow

### Local Testing with Enhanced Data

Use DynamoDB Local for development:

```bash
# Install DynamoDB Local
npm install -g dynamodb-local

# Start local instance
dynamodb-local

# Point application to local DynamoDB
export AWS_DYNAMODB_ENDPOINT=http://localhost:8000
```

### Enhanced Testing Strategy

1. **Unit Tests**: Test enhanced access patterns and data transformations
2. **Integration Tests**: End-to-end workflows with rich data
3. **Performance Tests**: Query performance with comprehensive projections
4. **Cost Tests**: Monitor expenses with enhanced schemas
5. **Analytics Tests**: Validate analytics data collection and aggregation

## Security & Compliance

### IAM Policies (Enhanced)

The CDK creates role-based access policies:

- **Application Role**: Read/write access for app operations
- **Admin Role**: Full access for administrative functions
- **Analytics Role**: Read-only access for reporting (future)

### Data Protection (PRD-Aligned)

- **Encryption at rest**: AWS managed keys
- **Encryption in transit**: HTTPS/TLS
- **Access logging**: CloudTrail integration
- **GDPR compliance**: User data deletion capabilities
- **Audit trails**: Admin action logging

## Troubleshooting

### Common Issues

#### 1. Enhanced Schema Validation Errors

```bash
# Check data structure matches PRD schemas
aws dynamodb scan --table-name HustleHubDirectory-development --filter-expression "attribute_not_exists(filterValues)"
```

#### 2. GSI Throttling with Comprehensive Projections

```bash
# Monitor GSI2 (enhanced listings) performance
aws cloudwatch get-metric-statistics --namespace AWS/DynamoDB --metric-name ConsumedReadCapacityUnits --dimensions Name=TableName,Value=HustleHubDirectory-development Name=GlobalSecondaryIndexName,Value=GSI2-ListingsByDateIndex
```

#### 3. Cost Optimization

```bash
# Monitor enhanced projection costs
aws ce get-cost-and-usage --time-period Start=2024-01-01,End=2024-02-01 --granularity MONTHLY --metrics BlendedCost --group-by Type=DIMENSION,Key=SERVICE
```

## Performance Optimization

### Best Practices for Enhanced Schemas

1. **Query Patterns**: Design for single-partition queries where possible
2. **Projection Optimization**: Monitor GSI2 projection usage and optimize
3. **Client-Side Filtering**: Leverage rich filter data for fast client-side operations
4. **Caching Strategy**: Cache frequently accessed categories and popular listings
5. **Analytics Aggregation**: Pre-aggregate analytics data to reduce query costs

### Scaling Considerations

- **Partition Key Distribution**: Monitor for hot partitions with analytics data
- **GSI Costs**: Balance comprehensive projections with query efficiency
- **Data Lifecycle**: Archive old analytics data to control storage costs
- **Regional Deployment**: Consider multi-region for global scale

## Next Steps

After successful deployment:

1. **Implement Enhanced Data Access Layer** in your application
2. **Set up Analytics Pipeline** for business intelligence
3. **Configure Advanced Monitoring** with custom dashboards
4. **Create Migration Scripts** from existing data sources
5. **Setup A/B Testing** for new feature validation
6. **Implement Caching Layer** for performance optimization

## Support & Documentation

For questions or issues:

1. Check the [Enhanced Design Documents](./dynamoDB_table_design.md) in this repository
2. Review the [GSI Design Guide](./dynamodb-gsi-design.md) for query patterns
3. Consult the [Implementation Strategy](./dynamoDB-design.md) for best practices
4. Reference the [AWS DynamoDB documentation](https://docs.aws.amazon.com/dynamodb/)

## Conclusion

This enhanced DynamoDB infrastructure fully supports the comprehensive vision defined in the updated PRD, providing:

- **Rich Data Models** for superior user experiences
- **Scalable Architecture** for growth from hundreds to millions of users
- **Analytics Integration** for data-driven decision making  
- **SEO Optimization** for organic discovery and growth
- **Community Readiness** for future social features
- **Cost Efficiency** through intelligent design and monitoring

The infrastructure forms the solid foundation for building the UK's leading side hustle directory platform.
