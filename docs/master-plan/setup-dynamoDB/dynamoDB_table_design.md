# DynamoDB Single-Table Design for Hustle Hub

## Table Overview

**Table Name**: `HustleHubDirectory`
**Primary Key**: Composite (PK + SK)

- **Partition Key (PK)**: STRING
- **Sort Key (SK)**: STRING

## Entity Design

| Entity     | Item Type (type) | PK                   | SK                          | Other Attributes                                                                   | Notes                                                                                       |
| :--------- | :--------------- | :------------------- | :-------------------------- | :--------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------ |
| User       | User             | USER#<cognito_sub>   | PROFILE#<cognito_sub>       | email, preferences, onboardingComplete, createdAt, lastLoginAt                     | Enhanced user profiles with personalization data from PRD.                                 |
| Admin      | Admin            | USER#<cognito_sub>   | ADMIN#<cognito_sub>         | role, adminCreatedAt, adminCreatedBy (<cognito_sub>)                               | Colocated with User. Efficiently check if a user is admin (A1).                             |
| Category   | Category         | CATEGORY#<catId>     | METADATA#<catId>            | slug, name, description, filterDefinitions, sortOrder, icon, metaData, schemaOrg, createdAt   | Enhanced categories with comprehensive filter definitions, SEO metadata, and schema.org structured data.                 |
| Category   | Category         | CATEGORIES           | SORT#<sortOrder>#<catId>    | catId, slug, name, description, icon, totalListings                                | Efficiently list all categories (C2) with listing counts.                                   |
| Listing    | Listing          | LISTING#<listingId>  | METADATA#<listingId>        | listingId, slug, title, description, category, primaryAttributes, secondaryAttributes, tags, rating, keywords, verified, verificationLevel, isActive, lastCheckedAt, curatedBy, earnings, requirements, filterValues, externalUrls, sourceUrls, metaData, schemaOrg, analytics, embeddingVector, createdAt, updatedAt | Rich listing data with enhanced attributes, earnings, requirements, filter values, analytics, and schema.org structured data for SEO.       |
| Listing    | Listing          | CATEGORY#<catId>     | LISTING#<listingId>         | listingId, slug, title, categoryName, primaryAttributes, tags, rating, earnings, requirements, filterValues, verified, isActive, imageUrl, analytics, createdAt | Supports category browsing and client-side filtering with comprehensive filter data.        |
| Favourite  | Favourite        | USER#<cognito_sub>   | FAVOURITE#<listingId>       | listingId, listingTitle, categoryName, favouritedAt                                | Enhanced favourites with category information for better organization.                      |
| Favourite  | Favourite        | LISTING#<listingId>  | FAVOURITED_BY#<cognito_sub> | userId (<cognito_sub>), favouritedAt                                               | Supports analytics on listing popularity.                                                   |
| (Slug Map) | SlugMapping      | SLUG#category#<slug> | ID#<catId>                  | catId, entityType                                                                  | Supports category slug lookups with entity type for validation.                             |
| (Slug Map) | SlugMapping      | SLUG#listing#<slug>  | ID#<listingId>              | listingId, entityType                                                              | Supports listing slug lookups with entity type for validation.                              |

## Detailed Entity Specifications

### User Entity (Enhanced Profile)

```json
{
  "PK": "USER#123e4567-e89b-12d3-a456-426614174000",
  "SK": "PROFILE#123e4567-e89b-12d3-a456-426614174000",
  "type": "User",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "preferences": {
    "skills": ["Writing", "Design", "Customer Service"],
    "interests": ["Creative", "Tech", "Animals"],
    "location": "London",
    "timeAvailability": "medium",
    "preferredIncome": "medium"
  },
  "onboardingComplete": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "lastLoginAt": "2024-01-20T14:30:00Z",
  "GSI1PK": "USER_EMAIL#user@example.com",
  "GSI1SK": "PROFILE#123e4567-e89b-12d3-a456-426614174000"
}
```

### Admin Entity

```json
{
  "PK": "USER#123e4567-e89b-12d3-a456-426614174000",
  "SK": "ADMIN#123e4567-e89b-12d3-a456-426614174000",
  "type": "Admin",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "role": "admin",
  "adminCreatedAt": "2024-01-15T10:30:00Z",
  "adminCreatedBy": "456e7890-e89b-12d3-a456-426614174001",
  "GSI3PK": "ADMINS",
  "GSI3SK": "ROLE#admin#123e4567-e89b-12d3-a456-426614174000"
}
```

### Category Entity (Enhanced Metadata)

```json
{
  "PK": "CATEGORY#create-and-sell",
  "SK": "METADATA#create-and-sell",
  "type": "Category",
  "slug": "create-and-sell",
  "name": "Create & Sell",
  "description": "Focus on making or sourcing products and selling them",
  "filterDefinitions": {
    "platform": {
      "name": "Platform",
      "type": "multiselect",
      "options": ["Etsy", "Amazon", "eBay", "Facebook Marketplace", "Depop", "Vinted"]
    },
    "productType": {
      "name": "Product Type",
      "type": "multiselect", 
      "options": ["Handmade", "Digital", "Print-on-Demand", "Reselling", "Vintage"]
    },
    "skillsRequired": {
      "name": "Skills Required",
      "type": "multiselect",
      "options": ["Photography", "Design", "Crafting", "Customer Service", "None"]
    },
    "startupCost": {
      "name": "Startup Cost",
      "type": "select",
      "options": ["None", "Low", "Medium", "High"]
    }
  },
  "sortOrder": 1,
  "icon": "shopping-bag",
  "metaData": {
    "seoTitle": "Create & Sell Side Hustles - UK Directory",
    "seoDescription": "Discover opportunities to create and sell products in the UK...",
    "totalListings": 25
  },
  
  // Schema.org structured data for SEO (optional)
  "schemaOrg": {
    "defaultSchemaType": "Service",
    "categorySchema": {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Create & Sell Side Hustles",
      "description": "Opportunities to create and sell products in the UK",
      "url": "https://hustlehub.uk/categories/create-and-sell"
    }
  },
  
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Category Entity (For Listing)

```json
{
  "PK": "CATEGORIES",
  "SK": "SORT#001#create-and-sell",
  "type": "Category",
  "catId": "create-and-sell",
  "slug": "create-and-sell",
  "name": "Create & Sell",
  "description": "Focus on making or sourcing products and selling them",
  "icon": "shopping-bag",
  "sortOrder": 1,
  "totalListings": 25
}
```

### Listing Entity (Enhanced Metadata)

```json
{
  "PK": "LISTING#etsy-handmade-crafts",
  "SK": "METADATA#etsy-handmade-crafts",
  "type": "Listing",
  "listingId": "etsy-handmade-crafts",
  "slug": "selling-handmade-crafts-etsy",
  "title": "Selling Handmade Crafts on Etsy",
  "description": "Create and sell unique handmade items through Etsy's marketplace. Build a sustainable creative business by leveraging Etsy's built-in audience...",
  "category": "create-and-sell",
  
  // Core display attributes (user-facing, standardized values)
  "primaryAttributes": {
    "skillLevel": "Intermediate",
    "timeCommitment": "Medium", 
    "upfrontCost": "Low",
    "incomePotential": "££",
    "locationType": "Online",
    "platformRequired": "Etsy"
  },
  
  // Additional descriptive attributes
  "secondaryAttributes": {
    "deviceNeeded": "Laptop required",
    "assetsNeeded": "Crafting materials",
    "riskLevel": "Low",
    "gettingPaidSpeed": "Weekly",
    "flexibility": "Fully Flexible"
  },
  
  "tags": ["Trustie Gem", "Top 10", "Trending"],
  "rating": 8.7,
  "keywords": ["etsy", "handmade", "crafts", "jewelry", "side hustle", "sell online"],
  
  "verified": true,
  "verificationLevel": "manual",
  "isActive": true,
  "lastCheckedAt": "2025-01-15T10:30:00Z",
  "curatedBy": "Skye AI",
  
  // Detailed financial information
  "earnings": {
    "min": 100,
    "max": 2000,
    "type": "monthly",
    "disclaimer": "Earnings vary significantly based on product quality, marketing, and time investment"
  },
  
  // Detailed requirements (exact values, arrays)
  "requirements": {
    "skills": ["Crafting", "Photography", "Customer Service"],
    "equipment": ["Camera", "Crafting Materials"],
    "qualifications": [],
    "startupCost": 50,
    "timeCommitment": {
      "min": 5,
      "max": 20,
      "flexibility": "high"
    }
  },
  
  // Normalized filter values (for client-side filtering)
  "filterValues": {
    "location": "online",
    "platform": ["Etsy"],
    "skillsRequired": ["Crafting", "Photography", "Customer Service"],
    "incomePotential": "medium",
    "startupCost": "low",
    "interests": ["Creative", "DIY", "Fashion"]
  },
  
  "externalUrls": {
    "primary": "https://www.etsy.com/uk/sell",
    "additional": ["https://help.etsy.com/hc/en-gb"],
    "tutorial": "https://blog.etsy.com/en/selling-on-etsy-guide/"
  },
  
  "sourceUrls": [
    "https://www.etsy.com/sell",
    "https://www.bigcommerce.co.uk/blog/selling-on-etsy-uk/"
  ],
  
  "metaData": {
    "seoTitle": "Selling Handmade Crafts on Etsy - Complete UK Guide",
    "seoDescription": "Learn how to start selling handmade crafts on Etsy...",
    "prosCons": {
      "pros": ["Built-in marketplace", "Creative freedom", "Global reach"],
      "cons": ["Competition", "Platform fees", "SEO knowledge needed"]
    },
    "type": "Active",
    "monetizationType": "Sales-based",
    "engagementMode": "Solo"
  },
  
  "analytics": {
    "views": 1250,
    "saves": 89,
    "shares": 23,
    "clicks": 156
  },
  
  // Schema.org structured data for SEO (optional)
  "schemaOrg": {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Selling Handmade Crafts on Etsy",
    "description": "Create and sell unique handmade items through Etsy's marketplace",
    "provider": {
      "@type": "Organization",
      "name": "Etsy"
    },
    "serviceType": "E-commerce Platform",
    "areaServed": "United Kingdom",
    "offers": {
      "@type": "Offer",
      "priceRange": "£100-£2000",
      "priceCurrency": "GBP"
    },
    "url": "https://hustlehub.uk/listings/selling-handmade-crafts-etsy"
  },
  
  // AI/ML features
  "embeddingVector": [0.023, -0.015, 0.077],
  
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T16:45:00Z",
  "GSI2PK": "LISTINGS",
  "GSI2SK": "CREATED#2024-01-15T10:30:00Z#etsy-handmade-crafts"
}
```

### Listing Entity (Category Association - Enhanced)

```json
{
  "PK": "CATEGORY#create-and-sell",
  "SK": "LISTING#etsy-handmade-crafts",
  "type": "Listing",
  "listingId": "etsy-handmade-crafts",
  "slug": "selling-handmade-crafts-etsy",
  "title": "Selling Handmade Crafts on Etsy",
  "categoryName": "Create & Sell",
  
  // Core display attributes (consistent with main entity)
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
  
  // Simplified earnings for listing display
  "earnings": {
    "min": 100,
    "max": 2000,
    "type": "monthly"
  },
  
  // Essential requirements for filtering/display
  "requirements": {
    "startupCost": 50,
    "timeCommitment": {
      "min": 5,
      "max": 20,
      "flexibility": "high"
    }
  },
  
  // Consistent filter values (matches main entity)
  "filterValues": {
    "location": "online",
    "platform": ["Etsy"],
    "skillsRequired": ["Crafting", "Photography", "Customer Service"],
    "incomePotential": "medium",
    "startupCost": "low",
    "interests": ["Creative", "DIY", "Fashion"]
  },
  
  "verified": true,
  "isActive": true,
  "imageUrl": "https://images.hustlehub.uk/listings/etsy-crafts.jpg",
  "analytics": {
    "views": 1250,
    "saves": 89
  },
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Favourite Entity (Enhanced)

```json
{
  "PK": "USER#123e4567-e89b-12d3-a456-426614174000",
  "SK": "FAVOURITE#etsy-handmade-crafts",
  "type": "Favourite",
  "listingId": "etsy-handmade-crafts",
  "listingTitle": "Selling Handmade Crafts on Etsy",
  "categoryName": "Create & Sell",
  "categorySlug": "create-and-sell",
  "favouritedAt": "2024-01-16T14:20:00Z"
}
```

### Slug Mapping Entities (Enhanced)

```json
{
  "PK": "SLUG#category#create-and-sell",
  "SK": "ID#create-and-sell",
  "type": "SlugMapping",
  "catId": "create-and-sell",
  "entityType": "category",
  "GSI4PK": "SLUG#category#create-and-sell",
  "GSI4SK": "ID#create-and-sell"
}
```

```json
{
  "PK": "SLUG#listing#selling-handmade-crafts-etsy",
  "SK": "ID#etsy-handmade-crafts",
  "type": "SlugMapping",
  "listingId": "etsy-handmade-crafts",
  "entityType": "listing",
  "GSI4PK": "SLUG#listing#selling-handmade-crafts-etsy",
  "GSI4SK": "ID#etsy-handmade-crafts"
}
```

## Enhanced Category Structure (Aligned with PRD)

The platform uses the 5-category structure defined in the PRD:

### 1. Create & Sell (create-and-sell)
- **Examples**: Handmade goods, digital products, print-on-demand, reselling, stock content
- **Platforms**: Etsy, Amazon, eBay, Depop, Vinted, Facebook Marketplace

### 2. Offer Your Skills (offer-your-skills)  
- **Examples**: Writing, design, tech, marketing, tutoring, performance, admin support
- **Platforms**: Fiverr, Upwork, PeoplePerHour, Freelancer

### 3. Share & Rent Your Assets (share-rent-assets)
- **Examples**: Spare rooms, vehicles, storage space, equipment rental
- **Platforms**: Airbnb, Turo, JustPark, Fat Llama

### 4. Local Tasks & Services (local-tasks-services)
- **Examples**: Delivery, pet care, home services, childcare, event staff, errands
- **Platforms**: TaskRabbit, Bark, Rover, Care.com

### 5. Online Tasks & Content (online-tasks-content)
- **Examples**: Surveys, testing, microtasks, content creation, social media, affiliate marketing
- **Platforms**: Swagbucks, UserTesting, YouTube, TikTok, Instagram

## Comprehensive Filter System

The filter system supports the cross-category filtering defined in the PRD:

### Essential Filters Applied Across Categories:

- **Location**: `online`, `local`, `uk-wide`
- **Platform Specific**: Platform-specific arrays for each category
- **Skills Required**: Comprehensive skill taxonomy
- **Income Potential**: `low`, `medium`, `high` (based on earnings data)
- **Time Commitment**: Flexible structures with min/max hours and flexibility ratings
- **Startup Cost**: Granular cost bands with specific amounts
- **Interests**: Interest-based tagging for discovery

## Access Pattern Examples (Updated)

### Enhanced Query Examples

1. **Get Enhanced User Profile**
   ```
   GetItem: PK = "USER#123e4567-e89b-12d3-a456-426614174000", SK = "PROFILE#123e4567-e89b-12d3-a456-426614174000"
   ```

2. **List Categories with Metadata**
   ```
   Query: PK = "CATEGORIES", SortBy: SK
   ```

3. **Get Category with Filter Definitions**
   ```
   GetItem: PK = "CATEGORY#create-and-sell", SK = "METADATA#create-and-sell"
   ```

4. **List Listings by Category (with Filter Data)**
   ```
   Query: PK = "CATEGORY#create-and-sell", SK begins_with "LISTING#"
   ```

5. **Client-Side Filtering Example**
   ```javascript
   // After fetching category listings, filter client-side
   const filteredListings = listings.filter(listing => {
     return listing.filterValues.incomePotential === 'medium' &&
            listing.filterValues.startupCost === 'low' &&
            listing.filterValues.platform.includes('Etsy');
   });
   ```

6. **Enhanced Favourites with Category Info**
   ```
   Query: PK = "USER#123e4567-e89b-12d3-a456-426614174000", SK begins_with "FAVOURITE#"
   ```

## Performance Considerations

### Client-Side Filtering Strategy

Given the expected data volume (hundreds of listings, not thousands), the PRD's approach of server-side category filtering + client-side attribute filtering is optimal:

1. **Server-side**: Query by category (efficient DynamoDB operation)
2. **Client-side**: Filter by attributes like income, skills, platform (fast in-memory operations)
3. **Future**: Implement AWS OpenSearch when dataset grows larger

### Data Denormalization

- **Category names** stored with listings for efficient display
- **Filter values** pre-calculated and stored for fast client-side filtering  
- **Analytics data** aggregated at write time for quick retrieval
- **Essential metadata** projected in GSIs for list views

## Item Size Considerations

- **Comprehensive listings**: Up to ~50KB per listing (well within 400KB limit)
- **Filter definitions**: Stored as efficient JSON structures
- **User preferences**: Lightweight preference objects
- **Analytics**: Aggregated counters to minimize size
- **Large descriptions**: Consider S3 storage for very long content

## Schema.org Structured Data Integration

### Purpose and Implementation

The `schemaOrg` field in both Category and Listing entities contains JSON-LD structured data following schema.org standards. This data is used to enhance SEO and enable rich search results in Google and other search engines.

### Usage in Application

During static site generation (SSG) or server-side rendering (SSR) with Next.js, the `schemaOrg` data is inserted into page `<head>` sections as:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Selling Handmade Crafts on Etsy",
  // ... rest of schema data
}
</script>
```

### Data Generation Strategy

1. **Direct Use**: If `schemaOrg` field exists, use it directly
2. **Template Generation**: If missing, generate from templates using listing/category data
3. **Category Inheritance**: Listings inherit `defaultSchemaType` from their parent category
4. **Override Support**: Individual listings can override any schema properties

### Schema Types by Category

- **Create & Sell**: `Product`, `Service`, or `CreativeWork`
- **Offer Your Skills**: `Service` or `ProfessionalService`
- **Rent or Share Your Stuff**: `Service` or `Product`
- **Help Out Locally**: `Service` or `LocalBusiness`
- **Do Quick Jobs Online**: `Service` or `DigitalService`
- **Be a Creator**: `CreativeWork` or `Service`
- **Play with Tech & Trends**: `Service` or `SoftwareApplication`

### Optional Override Fields

The `schemaOrg` object supports these optional overrides:
- `schemaType`: Override the @type (e.g., "HowTo", "Course", "Product")
- `schemaName`: Override the name field
- `schemaDescription`: Override the description
- `provider`: Specify service provider details
- `offers`: Include pricing and availability information
- `url`: Canonical URL for the listing
- `areaServed`: Geographic area (defaults to "United Kingdom")

### Best Practices

1. **Keep Compact**: Store only essential overrides, generate common fields from templates
2. **Validate Schema**: Ensure all schema objects validate against schema.org specifications
3. **Update Regularly**: Refresh schema data when listing details change
4. **Test Rich Results**: Use Google's Rich Results Test tool for validation

## Best Practices Applied

1. **Enhanced Denormalization**: Rich metadata for efficient querying
2. **Comprehensive Filtering**: Pre-calculated filter values for fast client-side operations
3. **Analytics Integration**: Built-in analytics data for insights
4. **SEO Optimization**: Metadata fields and schema.org structured data for search engine optimization
5. **User Personalization**: Rich user profiles supporting recommendation engines
6. **Community Readiness**: Schema supports future community features (reviews, ratings)
7. **Structured Data**: Schema.org JSON-LD integration for rich search results and improved SEO

This enhanced design fully aligns with the PRD's vision for a comprehensive, user-centric side hustle directory with rich metadata, powerful filtering, scalable architecture, and advanced SEO capabilities.
