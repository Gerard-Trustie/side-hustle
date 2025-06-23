# DynamoDB Global Secondary Indexes (GSI) Design

## Overview

This document defines the Global Secondary Indexes for the HustleHubDirectory table. Each GSI is designed to support specific access patterns that cannot be efficiently handled by the main table's primary key structure. The design aligns with the enhanced data models defined in the updated PRD.

## GSI Design Principles

1. **Sparse Indexes**: Only items with the relevant GSI attributes will appear in the index
2. **Cost Optimization**: Minimal projected attributes to reduce storage and cost
3. **Access Pattern Focus**: Each GSI serves specific, well-defined query patterns
4. **Key Distribution**: Designed to avoid hot partitions
5. **PRD Alignment**: Supports the comprehensive feature set defined in the updated PRD

---

## GSI1: User Email Lookup

### Purpose

Find users by their email address for authentication and user lookup operations.

### Structure

- **Index Name**: `GSI1-UserEmailIndex`
- **Partition Key**: `GSI1PK` (STRING)
- **Sort Key**: `GSI1SK` (STRING)
- **Projection Type**: `KEYS_ONLY`

### Key Patterns

```
GSI1PK: USER_EMAIL#<email>
GSI1SK: PROFILE#<cognito_sub>
```

### Access Patterns Supported

- **U3**: Find User by Email (for login processes)
- **Backend operations**: User lookup by email for admin functions
- **Community features**: User profile lookups for future community functionality

### Example Items

```json
{
  "GSI1PK": "USER_EMAIL#john.doe@example.com",
  "GSI1SK": "PROFILE#123e4567-e89b-12d3-a456-426614174000",
  "PK": "USER#123e4567-e89b-12d3-a456-426614174000",
  "SK": "PROFILE#123e4567-e89b-12d3-a456-426614174000"
}
```

### Query Examples

```typescript
// Find user by email
const params = {
  IndexName: 'GSI1-UserEmailIndex',
  KeyConditionExpression: 'GSI1PK = :email',
  ExpressionAttributeValues: {
    ':email': 'USER_EMAIL#john.doe@example.com',
  },
};
```

### Cost Considerations

- **Storage**: Minimal (KEYS_ONLY projection)
- **Write Cost**: One additional write per user creation/update
- **Read Cost**: Efficient single-item lookups

---

## GSI2: Listings by Creation Date (Enhanced)

### Purpose

List all listings sorted by creation date for admin views, recent listings pages, and general browsing. Enhanced with comprehensive metadata for rich listing displays.

### Structure

- **Index Name**: `GSI2-ListingsByDateIndex`
- **Partition Key**: `GSI2PK` (STRING)
- **Sort Key**: `GSI2SK` (STRING)
- **Projection Type**: `INCLUDE`

### Enhanced Projected Attributes

```
listingId, slug, title, categoryName, categorySlug, primaryAttributes, 
earnings, requirements, filterValues, imageUrl, verified, verificationLevel, 
analytics, createdAt, tags, rating, keywords, isActive,
externalUrls, metaData, schemaOrg
```

### Key Patterns

```
GSI2PK: LISTINGS (static value for all listings)
GSI2SK: CREATED#<ISO8601_timestamp>#<listingId>
```

### Access Patterns Supported

- **L2**: List All Listings (sorted by creation date)
- **Admin**: Bulk listing management with rich metadata
- **Homepage**: Recent listings display with earnings and requirements
- **Analytics**: Trending listings based on views/saves
- **API**: Comprehensive listing data for mobile apps

### Example Items

```json
{
  "GSI2PK": "LISTINGS",
  "GSI2SK": "CREATED#2024-01-15T10:30:00Z#etsy-handmade-crafts",
  "listingId": "etsy-handmade-crafts",
  "slug": "selling-handmade-crafts-etsy",
  "title": "Selling Handmade Crafts on Etsy",
  "categoryName": "Create & Sell",
  "categorySlug": "create-and-sell",
  
  "primaryAttributes": {
    "skillLevel": "Intermediate",
    "timeCommitment": "Medium",
    "upfrontCost": "Low",
    "incomePotential": "££",
    "locationType": "Online",
    "platformRequired": "Etsy"
  },
  
  "tags": ["Trustie Gem", "Top 10", "Trending"],
  "rating": 8.7,
  "keywords": ["etsy", "handmade", "crafts", "jewelry", "side hustle", "sell online"],
  
  "earnings": {
    "min": 100,
    "max": 2000,
    "type": "monthly"
  },
  "requirements": {
    "startupCost": 50,
    "timeCommitment": {
      "min": 5,
      "max": 20,
      "flexibility": "high"
    }
  },
  "filterValues": {
    "location": "online",
    "platform": ["Etsy"],
    "skillsRequired": ["Crafting", "Photography"],
    "incomePotential": "medium",
    "startupCost": "low",
    "interests": ["Creative"]
  },
  "verified": true,
  "verificationLevel": "manual",
  "isActive": true,
  "imageUrl": "https://images.hustlehub.uk/listings/etsy-crafts.jpg",
  "analytics": {
    "views": 1250,
    "saves": 89,
    "shares": 23,
    "clicks": 156
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "externalUrls": {
    "primary": "https://www.etsy.com/uk/sell"
  },
  "metaData": {
    "seoTitle": "Selling Handmade Crafts on Etsy - Complete UK Guide"
  },
  "schemaOrg": {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Selling Handmade Crafts on Etsy",
    "provider": {
      "@type": "Organization",
      "name": "Etsy"
    },
    "offers": {
      "@type": "Offer",
      "priceRange": "£100-£2000",
      "priceCurrency": "GBP"
    }
  }
}
```

### Query Examples

```typescript
// Get latest listings with rich metadata
const params = {
  IndexName: 'GSI2-ListingsByDateIndex',
  KeyConditionExpression: 'GSI2PK = :pk',
  ExpressionAttributeValues: {
    ':pk': 'LISTINGS',
  },
  ScanIndexForward: false, // Descending order (newest first)
  Limit: 20,
};

// Get trending listings (high analytics)
const params = {
  IndexName: 'GSI2-ListingsByDateIndex',
  KeyConditionExpression: 'GSI2PK = :pk',
  FilterExpression: 'analytics.views > :minViews',
  ExpressionAttributeValues: {
    ':pk': 'LISTINGS',
    ':minViews': 1000,
  },
  Limit: 10,
};

// Get verified listings only
const params = {
  IndexName: 'GSI2-ListingsByDateIndex',
  KeyConditionExpression: 'GSI2PK = :pk',
  FilterExpression: 'verified = :verified AND verificationLevel = :level',
  ExpressionAttributeValues: {
    ':pk': 'LISTINGS',
    ':verified': true,
    ':level': 'manual',
  },
};
```

### Cost Considerations

- **Storage**: Higher due to comprehensive INCLUDE projection (~3x base table storage)
- **Write Cost**: One additional write per listing creation/update
- **Read Cost**: Efficient for rich listing displays without additional GetItem calls
- **Optimization**: Consider projected attributes vs. additional GetItem costs

---

## GSI3: Admin Management (Enhanced)

### Purpose

List and manage admin users by role for superadmin operations, with enhanced user information for administrative dashboards.

### Structure

- **Index Name**: `GSI3-AdminManagementIndex`
- **Partition Key**: `GSI3PK` (STRING)
- **Sort Key**: `GSI3SK` (STRING)
- **Projection Type**: `INCLUDE`

### Enhanced Projected Attributes

```
userId, email, role, adminCreatedAt, adminCreatedBy, lastLoginAt, preferences
```

### Key Patterns

```
GSI3PK: ADMINS (static value for all admins)
GSI3SK: ROLE#<role>#<cognito_sub>
```

### Access Patterns Supported

- **A2**: List All Admins with contact information
- **Admin filtering**: Filter admins by role with user preferences
- **Audit**: Track admin creation and management with enhanced metadata
- **User management**: Admin user lookup with profile information

### Example Items

```json
{
  "GSI3PK": "ADMINS",
  "GSI3SK": "ROLE#admin#123e4567-e89b-12d3-a456-426614174000",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "email": "admin@hustlehub.uk",
  "role": "admin",
  "adminCreatedAt": "2024-01-15T10:30:00Z",
  "adminCreatedBy": "456e7890-e89b-12d3-a456-426614174001",
  "lastLoginAt": "2024-01-20T14:30:00Z",
  "preferences": {
    "location": "London",
    "skills": ["Content Management", "User Support"]
  }
}
```

### Query Examples

```typescript
// List all admins with user information
const params = {
  IndexName: 'GSI3-AdminManagementIndex',
  KeyConditionExpression: 'GSI3PK = :pk',
  ExpressionAttributeValues: {
    ':pk': 'ADMINS',
  },
};

// List super_admin users only
const params = {
  IndexName: 'GSI3-AdminManagementIndex',
  KeyConditionExpression: 'GSI3PK = :pk AND begins_with(GSI3SK, :role)',
  ExpressionAttributeValues: {
    ':pk': 'ADMINS',
    ':role': 'ROLE#super_admin',
  },
};

// Find recently active admins
const params = {
  IndexName: 'GSI3-AdminManagementIndex',
  KeyConditionExpression: 'GSI3PK = :pk',
  FilterExpression: 'lastLoginAt > :recentDate',
  ExpressionAttributeValues: {
    ':pk': 'ADMINS',
    ':recentDate': '2024-01-01T00:00:00Z',
  },
};
```

### Cost Considerations

- **Storage**: Low (small number of admins, moderate projection)
- **Write Cost**: One additional write per admin creation/update
- **Read Cost**: Infrequent but efficient admin operations

---

## GSI4: Slug Lookup (Enhanced)

### Purpose

Fast slug-based lookups for both categories and listings, supporting the URL structure defined in the PRD.

### Structure

- **Index Name**: `GSI4-SlugLookupIndex`
- **Partition Key**: `GSI4PK` (STRING)
- **Sort Key**: `GSI4SK` (STRING)
- **Projection Type**: `INCLUDE`

### Enhanced Projected Attributes

```
entityType, catId, listingId, verified, createdAt
```

### Key Patterns

```
GSI4PK: SLUG#<entityType>#<slug>
GSI4SK: ID#<entityId>
```

### Access Patterns Supported

- **C1**: Fetch Category by Slug (fast URL routing)
- **L1**: Fetch Listing by Slug (fast URL routing)
- **SEO**: Fast page generation for search engines
- **Validation**: Entity type validation for routing
- **Analytics**: Track slug-based access patterns

### Example Items

```json
{
  "GSI4PK": "SLUG#category#create-and-sell",
  "GSI4SK": "ID#create-and-sell",
  "entityType": "category",
  "catId": "create-and-sell",
  "verified": true,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

```json
{
  "GSI4PK": "SLUG#listing#selling-handmade-crafts-etsy",
  "GSI4SK": "ID#etsy-handmade-crafts",
  "entityType": "listing",
  "listingId": "etsy-handmade-crafts",
  "verified": true,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Query Examples

```typescript
// Find category by slug
const params = {
  IndexName: 'GSI4-SlugLookupIndex',
  KeyConditionExpression: 'GSI4PK = :slug',
  ExpressionAttributeValues: {
    ':slug': 'SLUG#category#create-and-sell',
  },
};

// Find listing by slug with validation
const params = {
  IndexName: 'GSI4-SlugLookupIndex',
  KeyConditionExpression: 'GSI4PK = :slug',
  FilterExpression: 'entityType = :type AND verified = :verified',
  ExpressionAttributeValues: {
    ':slug': 'SLUG#listing#selling-handmade-crafts-etsy',
    ':type': 'listing',
    ':verified': true,
  },
};

// Bulk slug validation
const params = {
  IndexName: 'GSI4-SlugLookupIndex',
  KeyConditionExpression: 'GSI4PK IN (:slug1, :slug2, :slug3)',
  ExpressionAttributeValues: {
    ':slug1': 'SLUG#listing#slug1',
    ':slug2': 'SLUG#listing#slug2', 
    ':slug3': 'SLUG#category#slug3',
  },
};
```

### Design Decision

**Implementation Note**: This GSI approach provides faster slug lookups compared to base table slug mapping items, with the tradeoff of additional storage costs. Given the importance of fast page loads for SEO (as specified in the PRD), this approach is recommended.

### Cost Considerations

- **Storage**: Low to moderate (one item per slug, minimal projection)
- **Write Cost**: One additional write per slug creation/update
- **Read Cost**: Very efficient for URL routing and SEO page generation

---

## Enhanced GSI Best Practices Applied

### 1. PRD Alignment

- **Rich Metadata**: GSI2 projects comprehensive listing data for rich displays
- **User Personalization**: GSI3 includes user preferences for admin dashboards
- **SEO Optimization**: GSI4 supports fast slug-based routing for search engines
- **Analytics Integration**: GSI2 includes analytics data for trending content

### 2. Key Distribution

- **Static partition keys**: Used strategically with known scalability limits
- **Email-based keys**: Naturally distributed across partitions
- **Composite sort keys**: Enable range queries and sorting
- **Entity type separation**: Clear entity boundaries for routing

### 3. Projection Optimization

- **KEYS_ONLY**: For simple lookups (GSI1)
- **INCLUDE**: Comprehensive projections for display-ready data (GSI2, GSI3, GSI4)
- **Essential attributes**: Only project frequently accessed data
- **Cost vs. performance**: Balance projection size with GetItem call reduction

### 4. Query Patterns

- **Single partition queries**: Optimized for best performance
- **Filter expressions**: Support complex filtering on projected attributes
- **Pagination support**: Sort keys designed for cursor-based pagination
- **Analytics queries**: Support for trending and popular content discovery

---

## Advanced Query Patterns for PRD Features

### 1. Personalized Recommendations (Future)

```typescript
// Get listings matching user preferences
const userPrefs = await getUserPreferences(userId);
const params = {
  IndexName: 'GSI2-ListingsByDateIndex',
  KeyConditionExpression: 'GSI2PK = :pk',
  FilterExpression: 'contains(filterValues.interests, :interest)',
  ExpressionAttributeValues: {
    ':pk': 'LISTINGS',
    ':interest': userPrefs.interests[0],
  },
};
```

### 2. Trending Content Discovery

```typescript
// Get trending listings based on analytics
const params = {
  IndexName: 'GSI2-ListingsByDateIndex',
  KeyConditionExpression: 'GSI2PK = :pk',
  FilterExpression: 'analytics.views > :threshold OR analytics.saves > :saveThreshold',
  ExpressionAttributeValues: {
    ':pk': 'LISTINGS',
    ':threshold': 1000,
    ':saveThreshold': 50,
  },
};
```

### 3. Admin Analytics Dashboard

```typescript
// Get admin activity summary
const params = {
  IndexName: 'GSI3-AdminManagementIndex',
  KeyConditionExpression: 'GSI3PK = :pk',
  FilterExpression: 'lastLoginAt > :since',
  ExpressionAttributeValues: {
    ':pk': 'ADMINS',
    ':since': '2024-01-01T00:00:00Z',
  },
};
```

---

## Monitoring and Optimization

### Key Metrics to Monitor

- **GSI2 storage costs**: Monitor comprehensive projection costs
- **Read/Write capacity consumption** per GSI
- **Throttling events** on any GSI, especially GSI2
- **Hot partition warnings** for static partition keys
- **Query patterns** and frequency for cost optimization

### Optimization Strategies

- **Monitor GSI2 projection usage**: Remove unused projected attributes
- **GSI1 efficiency**: Track email lookup patterns
- **GSI4 slug patterns**: Monitor slug access for caching opportunities
- **Archive old data**: Consider data lifecycle policies for GSI2
- **Adjust projections**: Based on actual application usage patterns

### Cost Analysis (Updated)

```typescript
// Estimated monthly costs (based on enhanced schemas and usage patterns)
// GSI1: ~$5/month (100k users, minimal projection)
// GSI2: ~$25/month (1k listings, comprehensive projection)
// GSI3: ~$2/month (small admin team, moderate projection)
// GSI4: ~$3/month (slug mappings, minimal projection)
// Total: ~$35/month for GSIs (vs. ~$23/month for base table)
```

---

## Implementation Notes

### CDK Configuration

The enhanced GSI definitions are implemented in `hustle-hub-table.ts` with appropriate projected attributes for the rich data models defined in the PRD.

### Application Code

Create type-safe interfaces for enhanced GSI queries:

```typescript
interface GSI1QueryParams {
  email: string;
}

interface GSI2QueryParams {
  limit?: number;
  lastEvaluatedKey?: any;
  reverse?: boolean;
  filterByAnalytics?: boolean;
  minViews?: number;
  verified?: boolean;
}

interface GSI3QueryParams {
  role?: 'admin' | 'super_admin' | 'editor';
  activeAfter?: string;
}

interface GSI4QueryParams {
  slug: string;
  entityType?: 'category' | 'listing';
  verified?: boolean;
}
```

### Testing Strategy

- **Unit tests**: Each enhanced GSI query pattern
- **Integration tests**: End-to-end access patterns with rich data
- **Load tests**: GSI performance under expected traffic with comprehensive projections
- **Cost tests**: Monitor enhanced GSI costs during development
- **Analytics tests**: Validate analytics-based queries and filtering

This enhanced GSI design fully supports the comprehensive feature set defined in the updated PRD, providing efficient access patterns for rich user experiences, powerful admin capabilities, and scalable analytics integration.
