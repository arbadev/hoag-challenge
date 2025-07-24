# CLAUDE.md

This file provides comprehensive guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Call Center Management System** - A production-ready React application for managing call center operations with role-based access control.

### Key Features
- **Real-time Queue Management**: Live updates for incoming calls with priority handling
- **Role-Based Access**: Separate interfaces for agents and administrators
- **Agent Management**: Track availability, assignments, and performance
- **Analytics Dashboard**: Real-time metrics and KPIs for administrators
- **Responsive Design**: Mobile-first approach with full desktop support

## Development Commands

### Core Development (use pnpm or npm)
- `pnpm dev` - Start development server with HMR at http://localhost:5173
- `pnpm build` - Create production build in `build/` directory
- `pnpm start` - Start production server from built files
- `pnpm typecheck` - Run TypeScript type checking and generate React Router types

### Package Manager
This project uses **pnpm** as the primary package manager (evidenced by pnpm-lock.yaml).

## Architecture

### Technology Stack
- **React 19** - Latest React with improved performance features
- **React Router v7** - Modern routing with SSR support
- **TypeScript 5.8** - Type safety with strict mode enabled
- **TailwindCSS v4** - Utility-first CSS with new features
- **Vite 6.3** - Lightning-fast build tool
- **shadcn/ui** - High-quality React components built on Radix UI

### Project Structure
```
app/
├── routes/                 # Page components (React Router v7 file-based routing)
│   ├── home.tsx           # Landing page
│   ├── login.tsx          # Authentication page
│   ├── dashboard.tsx      # Dashboard layout wrapper
│   └── dashboard/         # Dashboard sub-routes
│       ├── home.tsx       # Dashboard overview
│       ├── queue.tsx      # Call queue management
│       ├── agents.tsx     # Agent management (admin only)
│       └── analytics.tsx  # Analytics dashboard (admin only)
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components (Button, Card, Dialog, etc.)
│   ├── auth/             # Authentication components
│   │   └── role-selection-card.tsx
│   ├── layouts/          # Layout components
│   │   ├── main-layout.tsx
│   │   ├── header.tsx
│   │   └── sidebar.tsx
│   ├── modals/           # Modal dialogs
│   │   ├── assign-call-modal.tsx
│   │   ├── transfer-call-modal.tsx
│   │   ├── escalate-call-modal.tsx
│   │   └── call-details-modal.tsx
│   ├── providers/        # Provider wrapper components
│   ├── loading-states/   # Skeleton loaders
│   └── notifications/    # Toast notification components
├── contexts/             # React Context providers
│   ├── auth-context.tsx          # Authentication state
│   ├── call-queue-context.tsx    # Call queue management
│   ├── agents-context.tsx        # Agent management
│   └── data-management-context.tsx # Data persistence
├── lib/                  # Utilities and helpers
│   ├── utils.ts          # Common utilities including cn() function
│   ├── mock-data.ts      # Development mock data
│   ├── local-storage.ts  # Storage utilities
│   └── date-utils.ts     # Date formatting helpers
├── root.tsx              # Root layout with providers
├── routes.ts             # Route configuration
└── app.css              # Global styles and Tailwind directives
```

### Key Patterns
- **Server-Side Rendering**: Enabled by default in `react-router.config.ts`
- **Route Configuration**: Uses React Router v7 config format in `routes.ts`
- **TypeScript Paths**: `~/*` maps to `./app/*` for clean imports
- **Component Organization**: Grouped by feature/type for maintainability
- **Context Providers**: Wrapped in root App component for global state

### State Management Architecture
```typescript
App (root.tsx)
└── AuthProvider
    └── DataManagementProvider
        └── CallQueueProvider
            └── AgentsProvider
                └── Routes + NotificationProvider
```

## Coding Standards

### TypeScript Configuration
```json
{
  "strict": true,
  "target": "ES2022",
  "module": "ES2022",
  "jsx": "react-jsx",
  "paths": { "~/*": ["./app/*"] }
}
```

### Component Patterns
```typescript
// Component definition
interface ComponentNameProps {
  prop1: string;
  prop2?: boolean;
  onAction: (value: string) => void;
}

export function ComponentName({ prop1, prop2 = false, onAction }: ComponentNameProps) {
  // Implementation
}
```

### File Naming Conventions
- **Components**: `kebab-case.tsx` (e.g., `role-selection-card.tsx`)
- **Contexts**: `kebab-case-context.tsx` (e.g., `auth-context.tsx`)
- **Utilities**: `kebab-case.ts` (e.g., `date-utils.ts`)
- **Types**: Inline or in component file, not separate files

### Import Organization
```typescript
// External dependencies
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

// Internal components
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';

// Contexts and hooks
import { useAuth } from '~/contexts/auth-context';

// Utilities and types
import { cn } from '~/lib/utils';
```

### Styling Approach
- **Utility-First**: Use TailwindCSS utilities as primary styling method
- **Conditional Classes**: Use `cn()` utility for merging classes
```typescript
className={cn(
  "base-classes",
  condition && "conditional-classes",
  { "object-syntax": isActive }
)}
```
- **Component Variants**: Implement using class-variance-authority when needed
- **Responsive Design**: Mobile-first with Tailwind breakpoints (sm:, md:, lg:)

## Component Usage Examples

### Using shadcn/ui Components
```typescript
import { Button } from '~/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';

// Usage
<Card>
  <CardHeader>
    <CardTitle>Call Queue</CardTitle>
  </CardHeader>
  <CardContent>
    <Badge variant="destructive">High Priority</Badge>
    <Button onClick={handleAssign}>Assign Call</Button>
  </CardContent>
</Card>
```

### Context Usage
```typescript
import { useAuth } from '~/contexts/auth-context';
import { useCallQueue } from '~/contexts/call-queue-context';

function Component() {
  const { user, login, logout } = useAuth();
  const { calls, updateCall } = useCallQueue();
  
  // Component logic
}
```

### Form Handling Pattern
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  field1: z.string().min(1, "Required"),
  field2: z.number().positive()
});

function FormComponent() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { field1: '', field2: 0 }
  });
  
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Handle submission
  };
}
```

## Best Practices and Guidelines

### Performance
- Use React.memo for expensive components
- Implement proper loading states with Skeleton components
- Utilize React Router's loader pattern for data fetching
- Keep bundle size optimized with dynamic imports

### Error Handling
- Global error boundary in `root.tsx`
- Form validation with Zod schemas
- Toast notifications for user feedback
- Proper error states in async operations

### Accessibility
- ARIA labels on interactive elements
- Keyboard navigation support (Tab, Enter, Escape)
- Focus management in modals
- Screen reader friendly components

### Code Quality Checklist
When completing tasks, ensure:
- ✅ TypeScript types are properly defined (no `any`)
- ✅ Components follow established patterns
- ✅ Imports use `~` alias
- ✅ Loading and error states implemented
- ✅ Mobile responsive design tested
- ✅ Run `pnpm typecheck` passes without errors

## Mock Data System
The application includes a comprehensive mock data system for development:
- `lib/mock-data.ts` - Generates realistic call center data
- `lib/mock-data-persistent.ts` - Persists data in localStorage
- Includes calls, agents, departments, and analytics data

## Deployment

### Docker Configuration
Multi-stage Dockerfile optimized for production:
1. Dependencies installation stage
2. Build stage with TypeScript compilation
3. Production runtime with Node.js 20 Alpine

### Environment Requirements
- Node.js 20+
- pnpm or npm
- TypeScript 5.8+

## Important Notes

### No Linting/Formatting Tools
Currently, the project does not include:
- ESLint configuration
- Prettier configuration
- Automated formatting

Maintain code quality through:
- TypeScript strict mode
- Manual code review
- Following established patterns

### Authentication Flow
1. User selects role (Agent/Admin) on login page
2. Credentials validated (mock implementation)
3. User context updated with role and permissions
4. Redirect to appropriate dashboard
5. Role-based UI rendering throughout app

### Data Persistence
- Uses browser localStorage via `DataManagementContext`
- Automatically saves and restores:
  - User session
  - Call queue state
  - Agent availability
  - User preferences

## Component Hierarchy Overview

The application follows a clear component hierarchy:

1. **App Root** → Provides all contexts
2. **Protected Routes** → Role-based access control
3. **Layout Components** → Consistent UI structure
4. **Feature Components** → Business logic implementation
5. **UI Components** → Reusable shadcn/ui elements

Each level has specific responsibilities and maintains separation of concerns for maintainability and scalability.