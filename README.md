# Side Hustles Monorepo

A monorepo containing multiple Next.js applications for managing and exploring side hustles.

## Project Structure

This is a monorepo with the following applications:

- **`apps/admin-app`** - Administrative interface built with Next.js 14, featuring AWS integration, Radix UI components, and advanced data management capabilities
- **`apps/hustle-hub`** - Main user-facing application built with Next.js 15
- **`packages/types`** - Shared TypeScript type definitions
- **`packages/utils`** - Shared utility functions and AWS configurations

## Prerequisites

- Node.js 18+ 
- npm (comes with Node.js)
- Git

## Getting Started

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd side-hustles

# Install dependencies for all workspaces
npm install
```

### 2. Environment Setup

Create environment files as needed for each application:

```bash
# For admin-app (if AWS services are used)
cp apps/admin-app/.env.example apps/admin-app/.env.local

# For hustle-hub
cp apps/hustle-hub/.env.example apps/hustle-hub/.env.local
```

> **Note**: Environment files are gitignored. Contact your team lead for the required environment variables.

## Development

### Running Applications

#### Admin App
```bash
# Run admin app in development mode
npm run dev:admin

# Access at http://localhost:3000
```

#### Hustle Hub
```bash
# Run hustle hub in development mode  
npm run dev:hustle-hub

# Access at http://localhost:3000
```

#### Running Both Apps Simultaneously
```bash
# Terminal 1
npm run dev:admin

# Terminal 2 (different port will be auto-assigned)
npm run dev:hustle-hub
```

### Building Applications

```bash
# Build admin app
npm run build:admin

# Build hustle hub
npm run build:hustle-hub

# Build all applications
npm run build:all
```

### Linting

```bash
# Lint all workspaces
npm run lint:all

# Lint specific app
npm run lint --workspace=apps/admin-app
```

## Technology Stack

### Admin App
- **Framework**: Next.js 14 with App Router
- **UI Library**: Radix UI components with Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts and Chart.js
- **AWS Services**: DynamoDB, Lambda, S3
- **Styling**: Tailwind CSS with custom themes
- **Icons**: Lucide React

### Hustle Hub  
- **Framework**: Next.js 15 with App Router
- **React**: React 19
- **TypeScript**: Full TypeScript support

## Testing

Currently, testing setup varies by application. Check individual app directories for specific testing instructions.

```bash
# Example: If tests are available
cd apps/admin-app
npm test

# Or for hustle-hub
cd apps/hustle-hub  
npm test
```

## Project Scripts

| Script | Description |
|--------|-------------|
| `npm run dev:admin` | Start admin app in development mode |
| `npm run dev:hustle-hub` | Start hustle hub in development mode |
| `npm run build:admin` | Build admin app for production |
| `npm run build:hustle-hub` | Build hustle hub for production |
| `npm run build:all` | Build all applications |
| `npm run lint:all` | Lint all workspaces |
| `npm run clean` | Clean build artifacts and node_modules |

## Workspace Management

This project uses npm workspaces. You can run commands in specific workspaces:

```bash
# Install package in specific workspace
npm install <package-name> --workspace=apps/admin-app

# Run script in specific workspace  
npm run <script-name> --workspace=apps/admin-app
```

## Development Guidelines

1. **Shared Code**: Place reusable types in `packages/types` and utilities in `packages/utils`
2. **Component Library**: Admin app uses a comprehensive UI component library based on Radix UI
3. **TypeScript**: All applications use TypeScript with strict type checking
4. **Styling**: Tailwind CSS is used across applications
5. **Code Organization**: Follow the established patterns in each application

## Deployment

### Production Build
```bash
# Build all applications for production
npm run build:all
```

### Individual App Deployment
```bash
# Admin App
cd apps/admin-app
npm run build
npm run start

# Hustle Hub
cd apps/hustle-hub
npm run build  
npm run start
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: If running multiple apps, Next.js will automatically assign different ports
2. **Dependencies**: Run `npm install` in the root to ensure all workspace dependencies are installed
3. **Build errors**: Clean build artifacts with `npm run clean` and rebuild
4. **TypeScript errors**: Ensure all workspace references are properly configured

### Clean Installation
```bash
# Remove all node_modules and rebuild
npm run clean
npm install
```

## Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for all new code
3. Follow the established component and styling patterns
4. Test your changes in both development and build modes
5. Update documentation as needed

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Radix UI](https://www.radix-ui.com/) - UI component library used in admin app  
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [AWS SDK](https://docs.aws.amazon.com/sdk-for-javascript/) - AWS services integration
