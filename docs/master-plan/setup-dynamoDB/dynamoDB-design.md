# DynamoDB Design and Implementation Guide

## Overview

This document provides detailed instructions for implementing a single-table DynamoDB design for the Hustle Hub directory application. The design supports the transition from Supabase to AWS infrastructure using AWS Cognito for authentication and DynamoDB for data storage.

## Architecture Decisions

### Single-Table Design Rationale

We've chosen a single-table design for the following reasons:

1. **Performance**: Reduces the number of database calls by colocating related data
2. **Cost**: More cost-effective for small to medium-scale applications
3. **Scalability**: Better suited for DynamoDB's distributed architecture
4. **Access Patterns**: Optimized for our specific query requirements

### Authentication Strategy

- **From**: Supabase Auth
- **To**: AWS Cognito User Pools
- **User ID**: Cognito `sub` attribute will be used throughout the system
- **Integration**: AWS Amplify framework will manage authentication flow

### Filtering Strategy

Given the expected data volume (few hundred listings, 100k users):

- **Primary filtering**: Server-side by category (efficient DynamoDB queries)
- **Secondary filtering**: Client-side for attributes like location, skills, income potential
- **Future expansion**: Plan for AWS OpenSearch integration for complex server-side filtering

## Implementation Steps

### Step 1: Create DynamoDB Table

Use the provided CDK code in `migration-to-aws/hustle-hub-table.ts` to create:

```bash
# Deploy the CDK stack
cd migration-to-aws
npm install
cdk deploy HustleHubDatabaseStack
```

### Step 2: Table Configuration

**Table Name**: `HustleHubDirectory`
**Billing Mode**: Pay-per-request (suitable for MVP and scaling)
**Backup**: Point-in-time recovery enabled for production

### Step 3: Access Patterns Implementation

#### Primary Access Patterns

1. **User Management**

   - Create user profile on Cognito registration
   - Fetch user by Cognito sub
   - Check admin status

2. **Category Management**

   - List all categories (sorted)
   - Fetch category by ID or slug
   - Admin CRUD operations

3. **Listing Management**

   - Fetch listing by ID or slug
   - List listings by category
   - Filter listings (client-side)
   - Admin CRUD operations

4. **Favorites Management**
   - Save/unsave listing
   - List user's favorites
   - Check if listing is favorited

### Step 4: Data Access Layer Implementation

Create TypeScript interfaces and functions for each entity type:

```typescript
// Example interface structure
interface HustleHubItem {
  PK: string;
  SK: string;
  type: 'User' | 'Admin' | 'Category' | 'Listing' | 'Favourite' | 'SlugMapping';
  // Entity-specific attributes
}
```

### Step 5: Migration Strategy

#### Phase 1: Dual-Write Pattern

- Write to both Supabase and DynamoDB
- Read from Supabase
- Validate data consistency

#### Phase 2: Dual-Read Pattern

- Continue dual-write
- Read from DynamoDB
- Fallback to Supabase if needed

#### Phase 3: DynamoDB-Only

- Stop writing to Supabase
- Read only from DynamoDB
- Archive Supabase data

### Step 6: Data Seeding

1. Export data from Supabase
2. Transform to DynamoDB format
3. Batch write to DynamoDB
4. Validate data integrity

## Data Modeling Guidelines

### Key Design Principles

1. **Denormalization**: Duplicate frequently accessed data to avoid joins
2. **Hierarchical Structure**: Use PK/SK patterns to group related items
3. **Sparse Indexes**: Not all items will have all GSI attributes
4. **Type Safety**: Use consistent typing for item types and keys

### Naming Conventions

- **Partition Keys**: `ENTITY_TYPE#<identifier>`
- **Sort Keys**: `METADATA#<identifier>` for main entities, `RELATION#<identifier>` for relationships
- **GSI Keys**: `GSI1PK`, `GSI1SK`, etc.
- **Attributes**: camelCase for consistency with JavaScript/TypeScript

### Data Consistency Rules

1. **Strong Consistency**: Required for critical operations (admin actions, user profiles)
2. **Eventual Consistency**: Acceptable for listings, categories (default)
3. **Transactions**: Use for operations affecting multiple items

## Performance Considerations

### Read Patterns

- Most queries should be single-item or single-partition
- Use batch operations for multiple items
- Implement caching layer for frequently accessed data

### Write Patterns

- Batch writes for bulk operations
- Use conditional writes to prevent overwrites
- Implement retry logic with exponential backoff

### GSI Usage

- Monitor GSI throttling and hot partitions
- Design GSI partition keys to distribute load evenly
- Consider GSI costs in pricing calculations

## Security Implementation

### Access Control

- Use IAM policies for service-to-service access
- Implement fine-grained permissions in application layer
- Validate user permissions before DynamoDB operations

### Data Protection

- Encrypt sensitive data at application layer if needed
- Use DynamoDB encryption at rest (enabled by default)
- Implement audit logging for admin operations

## Monitoring and Alerting

### Key Metrics

- Read/Write capacity units consumed
- Throttled requests
- Error rates by operation type
- GSI performance metrics

### Alerting Thresholds

- Throttling rate > 1%
- Error rate > 0.5%
- Latency P99 > 100ms

## Development Workflow

### Local Development

1. Use DynamoDB Local for development
2. Implement seed scripts for test data
3. Use consistent data generation patterns

### Testing Strategy

1. Unit tests for data access layer
2. Integration tests for access patterns
3. Load testing for performance validation

### Deployment Process

1. Infrastructure changes via CDK
2. Application code deployment via CI/CD
3. Data migration scripts with rollback capability

## Error Handling

### Common Error Scenarios

- Item not found
- Conditional check failures
- Throttling errors
- Network timeouts

### Retry Strategies

- Exponential backoff for throttling
- Circuit breaker for persistent failures
- Dead letter queues for failed operations

## Future Considerations

### Scaling Patterns

- Horizontal scaling through partition key design
- Vertical scaling through read replicas
- Global tables for multi-region deployment

### Data Evolution

- Schema versioning strategy
- Backward compatibility requirements
- Migration patterns for schema changes

### Feature Additions

- Search integration with OpenSearch
- Analytics data warehouse integration
- Real-time features with DynamoDB Streams

## Cost Optimization

### Best Practices

- Use on-demand billing for variable workloads
- Monitor and optimize GSI usage
- Implement data lifecycle policies
- Use compression for large text fields

### Budget Monitoring

- Set up billing alerts
- Track costs by feature/team
- Regular cost optimization reviews

## Troubleshooting Guide

### Common Issues

1. **Hot Partitions**: Redesign partition key distribution
2. **GSI Throttling**: Review GSI key design and usage patterns
3. **Large Items**: Implement pagination or item splitting
4. **Slow Queries**: Review access patterns and indexes

### Debugging Tools

- CloudWatch metrics and logs
- X-Ray tracing for performance analysis
- DynamoDB console for data inspection
- Custom monitoring dashboards

## Success Criteria

### Performance Targets

- Read latency P99 < 50ms
- Write latency P99 < 100ms
- Availability > 99.9%
- Error rate < 0.1%

### Scalability Targets

- Support 100k users
- Handle 1k+ listings
- Scale to 10x current load without redesign

## Next Steps

1. Review and approve this design document
2. Set up development environment with DynamoDB Local
3. Implement data access layer with TypeScript
4. Create migration scripts from Supabase
5. Set up monitoring and alerting
6. Begin phase 1 of migration strategy

## References

- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [Single-Table Design Patterns](https://www.alexdebrie.com/posts/dynamodb-single-table/)
- [AWS CDK DynamoDB Documentation](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws-dynamodb-readme.html)
