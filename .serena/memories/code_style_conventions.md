# Code Style and Conventions

## TypeScript Configuration
- **Strict Mode**: Enabled for maximum type safety
- **Target**: ES2022
- **Module Resolution**: Bundler mode
- **Path Aliases**: `~/*` maps to `./app/*`
- **JSX**: react-jsx transform

## Component Patterns
- **Functional Components**: All components use function syntax
- **Named Exports**: Components exported as named functions
- **Props Interfaces**: Separate interface definitions with descriptive names (e.g., `RoleSelectionCardProps`)
- **File Naming**: kebab-case for files (e.g., `role-selection-card.tsx`)
- **Component Naming**: PascalCase for components

## State Management
- **Context Pattern**: Multiple context providers wrapped in root App
- **Custom Hooks**: `useAuth()`, `useCallQueue()`, etc. for context consumption
- **Local Storage**: Abstracted through utility functions

## Styling Approach
- **Utility Classes**: TailwindCSS utilities as primary styling method
- **Class Merging**: `cn()` utility from `lib/utils.ts` for conditional classes
- **Component Variants**: Using class-variance-authority for variant management
- **Responsive Design**: Mobile-first approach

## File Organization
- `app/routes/`: Page components with React Router v7 file-based routing
- `app/components/`: Reusable components organized by type
- `app/contexts/`: Global state management contexts
- `app/lib/`: Utility functions and helpers
- `app/components/ui/`: shadcn/ui components

## Import Conventions
- Absolute imports using `~` alias
- UI components from `~/components/ui/*`
- Group imports by type (external, internal, types)