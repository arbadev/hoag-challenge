# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Router v7 application with server-side rendering (SSR) enabled. It uses modern React patterns with TypeScript, Vite for bundling, and TailwindCSS for styling.

## Development Commands

### Core Development
- `npm run dev` - Start development server with HMR at http://localhost:5173
- `npm run build` - Create production build 
- `npm run start` - Start production server from built files
- `npm run typecheck` - Run TypeScript type checking and generate types

### Package Manager
This project uses `pnpm` (evidenced by pnpm-lock.yaml), but npm commands work as well.

## Architecture

### File Structure
- `app/` - Main application code
  - `root.tsx` - Root layout component with error boundary
  - `routes.ts` - Route configuration using React Router v7 config format
  - `routes/` - Route components (file-based routing)
  - `lib/utils.ts` - Utility functions (includes `cn` function for class merging)
  - `welcome/` - Welcome page components and assets
- `react-router.config.ts` - React Router configuration (SSR enabled)
- `vite.config.ts` - Vite configuration with TailwindCSS and tsconfigPaths plugins

### Key Patterns
- **Server-Side Rendering**: Enabled by default in `react-router.config.ts`
- **Route Configuration**: Uses new React Router v7 config format in `routes.ts`
- **TypeScript Paths**: `~/*` maps to `./app/*` for imports
- **Styling**: TailwindCSS with `clsx` and `tailwind-merge` utility in `app/lib/utils.ts`
- **Error Handling**: Global error boundary in `root.tsx` with dev/prod error display

### Route Structure
Routes are defined in `app/routes.ts` using the new config format:
```typescript
export default [index("routes/home.tsx")] satisfies RouteConfig;
```

### Component Patterns
- Route components export `meta` functions for SEO
- Layouts use the `Layout` component pattern from `root.tsx`
- Utility classes combined using the `cn()` function from `app/lib/utils.ts`

## Deployment

### Docker
Multi-stage Dockerfile provided for containerized deployment:
- Development dependencies stage
- Production dependencies stage  
- Build stage
- Final runtime stage with Node.js 20 Alpine

### Build Output
- `build/client/` - Static assets
- `build/server/` - Server-side code

## Dependencies

### Core
- React Router v7 for routing and SSR
- React 19 with TypeScript
- TailwindCSS for styling

### Utilities
- `class-variance-authority` - For component variants
- `clsx` + `tailwind-merge` - For conditional class names
- `lucide-react` - Icon library
- `isbot` - Bot detection for SSR

## Best Practices and Coding Guidelines

### Code Quality
- Always add descriptive variable names and functions

## Project components Hierarchy UML

`
graph TD
    %% Root Level
    App[App - Root Component]
    
    %% Auth Context Wrapper
    App --> AuthProvider[AuthProvider - Context]
    AuthProvider --> Router[Router - React Router]
    
    %% Main Routes
    Router --> PublicRoutes[Public Routes]
    Router --> ProtectedRoutes[Protected Routes]
    
    %% Public Routes
    PublicRoutes --> LoginPage[LoginPage]
    LoginPage --> RoleSelectionCard[RoleSelectionCard]
    RoleSelectionCard --> Card1[Card - shadcn]
    RoleSelectionCard --> Button1[Button - shadcn]
    RoleSelectionCard --> LucideIcons1[Users/UserCheck - lucide]
    
    %% Protected Routes Split
    ProtectedRoutes --> ProtectedRoute[ProtectedRoute - HOC]
    ProtectedRoute --> ProviderRoutes[Provider Routes]
    ProtectedRoute --> AdminRoutes[Admin Routes]
    
    %% Provider Layout and Pages
    ProviderRoutes --> ProviderLayout[ProviderLayout]
    ProviderLayout --> Sidebar1[Sidebar - shadcn]
    ProviderLayout --> Avatar1[Avatar - shadcn]
    ProviderLayout --> NavItems1[NavigationItems]
    NavItems1 --> Button2[Button - shadcn]
    
    ProviderLayout --> ProviderDashboard[ProviderDashboard]
    ProviderDashboard --> StatsCards[StatsCards]
    StatsCards --> Card2[Card - shadcn]
    StatsCards --> Badge1[Badge - shadcn]
    ProviderDashboard --> WeeklyScheduleView[WeeklyScheduleView - Shared]
    
    ProviderLayout --> ProviderAvailability[ProviderAvailability]
    ProviderAvailability --> AvailabilityForm[AvailabilityForm]
    AvailabilityForm --> Form1[Form - shadcn]
    AvailabilityForm --> Select1[Select - shadcn]
    AvailabilityForm --> Input1[Input - shadcn]
    AvailabilityForm --> Switch1[Switch - shadcn]
    AvailabilityForm --> Button3[Button - shadcn]
    
    ProviderAvailability --> AvailabilityList[AvailabilityList]
    AvailabilityList --> Table1[Table - shadcn]
    AvailabilityList --> Badge2[Badge - shadcn]
    AvailabilityList --> EditDialog[EditDialog]
    EditDialog --> Dialog1[Dialog - shadcn]
    EditDialog --> Form2[Form - shadcn]
    AvailabilityList --> DeleteConfirm[DeleteConfirmation]
    DeleteConfirm --> AlertDialog1[AlertDialog - shadcn]
    
    %% Admin Layout and Pages
    AdminRoutes --> AdminLayout[AdminLayout]
    AdminLayout --> Sidebar2[Sidebar - shadcn]
    AdminLayout --> Breadcrumb1[Breadcrumb - shadcn]
    AdminLayout --> Avatar2[Avatar - shadcn]
    AdminLayout --> Badge3[Badge - shadcn]
    
    AdminLayout --> AdminDashboard[AdminDashboard]
    AdminDashboard --> MetricsCards[MetricsCards]
    MetricsCards --> Card3[Card - shadcn]
    MetricsCards --> Progress1[Progress - shadcn]
    AdminDashboard --> Chart1[Chart - shadcn]
    AdminDashboard --> QuickApprovals[QuickApprovalsList]
    QuickApprovals --> ScrollArea1[ScrollArea - shadcn]
    QuickApprovals --> Card4[Card - shadcn]
    
    AdminLayout --> AdminScheduling[AdminScheduling]
    AdminScheduling --> PendingApprovals[PendingApprovals]
    PendingApprovals --> Tabs1[Tabs - shadcn]
    PendingApprovals --> ApprovalCard[ApprovalCard]
    ApprovalCard --> Card5[Card - shadcn]
    ApprovalCard --> Avatar3[Avatar - shadcn]
    ApprovalCard --> Button4[Button - shadcn]
    ApprovalCard --> Tooltip1[Tooltip - shadcn]
    
    AdminScheduling --> CalendarView[CalendarView]
    CalendarView --> CalendarGrid[CalendarGrid - Custom]
    CalendarGrid --> Popover1[Popover - shadcn]
    CalendarGrid --> ContextMenu1[ContextMenu - shadcn]
    CalendarGrid --> Badge4[Badge - shadcn]
    
    AdminScheduling --> ProviderFilter[ProviderFilter]
    ProviderFilter --> Command1[Command - shadcn]
    ProviderFilter --> Checkbox1[Checkbox - shadcn]
    ProviderFilter --> Toggle1[Toggle - shadcn]
    
    %% Shared Components
    WeeklyScheduleView --> WeeklyCalendar[WeeklyCalendar - Shared Component]
    CalendarView --> WeeklyCalendar
    WeeklyCalendar --> HoverCard1[HoverCard - shadcn]
    WeeklyCalendar --> Card6[Card - shadcn]
    WeeklyCalendar --> Separator1[Separator - shadcn]
    
    %% Global Components
    Router --> NotificationSystem[NotificationSystem - Global]
    NotificationSystem --> Sonner1[Sonner - shadcn]
    NotificationSystem --> Sheet1[Sheet - shadcn]
    
    Router --> LoadingStates[LoadingStates - Global]
    LoadingStates --> Skeleton1[Skeleton - shadcn]
    LoadingStates --> Progress2[Progress - shadcn]
    
    Router --> ErrorBoundary[ErrorBoundary - HOC]
    ErrorBoundary --> Alert1[Alert - shadcn]
    ErrorBoundary --> AlertDialog2[AlertDialog - shadcn]
    
    %% Custom Hooks (not components but important for hierarchy)
    AuthProvider -.-> useAuth[useAuth - Hook]
    ProviderAvailability -.-> useAvailability[useAvailability - Hook]
    AdminScheduling -.-> useSchedule[useSchedule - Hook]
    WeeklyCalendar -.-> useCalendarData[useCalendarData - Hook]
    
    %% HOC Relationships
    ProtectedRoute -.-> withAuth[withAuth - HOC]
    LoadingStates -.-> withLoadingState[withLoadingState - HOC]
    ErrorBoundary -.-> withErrorBoundary[withErrorBoundary - HOC]
    
    %% Style classes
    classDef page fill:#e0f2fe,stroke:#0284c7,stroke-width:2px
    classDef layout fill:#fef3c7,stroke:#d97706,stroke-width:2px
    classDef component fill:#d1fae5,stroke:#10b981,stroke-width:2px
    classDef shadcn fill:#f3e8ff,stroke:#9333ea,stroke-width:2px
    classDef hook fill:#fee2e2,stroke:#dc2626,stroke-width:1px,stroke-dasharray: 5 5
    classDef hoc fill:#ffedd5,stroke:#ea580c,stroke-width:1px,stroke-dasharray: 5 5
    
    %% Apply classes
    class LoginPage,ProviderDashboard,ProviderAvailability,AdminDashboard,AdminScheduling page
    class ProviderLayout,AdminLayout layout
    class RoleSelectionCard,StatsCards,AvailabilityForm,AvailabilityList,MetricsCards,PendingApprovals,CalendarView,ProviderFilter,WeeklyCalendar,NotificationSystem,LoadingStates component
    class Card1,Card2,Card3,Card4,Card5,Card6,Button1,Button2,Button3,Button4,Form1,Form2,Select1,Input1,Switch1,Table1,Badge1,Badge2,Badge3,Badge4,Dialog1,AlertDialog1,AlertDialog2,Sidebar1,Sidebar2,Avatar1,Avatar2,Avatar3,Breadcrumb1,Progress1,Progress2,Chart1,ScrollArea1,Tabs1,Tooltip1,Popover1,ContextMenu1,Command1,Checkbox1,Toggle1,HoverCard1,Separator1,Sonner1,Sheet1,Skeleton1,Alert1 shadcn
    class useAuth,useAvailability,useSchedule,useCalendarData hook
    class withAuth,withLoadingState,withErrorBoundary hoc`