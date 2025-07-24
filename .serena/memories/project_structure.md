# Project Structure

## Root Directory
```
hoag-challenge/
├── app/                    # Main application code
├── public/                 # Static assets
├── build/                  # Production build output (git-ignored)
├── .serena/               # Serena MCP configuration
├── .claude/               # Claude configuration
├── node_modules/          # Dependencies (git-ignored)
└── Configuration files
```

## App Directory Structure
```
app/
├── routes/                # Page components (React Router v7)
│   ├── home.tsx          # Landing page
│   ├── login.tsx         # Authentication page
│   ├── dashboard.tsx     # Dashboard layout
│   └── dashboard/        # Dashboard sub-routes
│       ├── home.tsx      # Dashboard home
│       ├── queue.tsx     # Call queue management
│       ├── agents.tsx    # Agent management
│       └── analytics.tsx # Analytics page
├── components/           # Reusable components
│   ├── ui/              # shadcn/ui components
│   ├── auth/            # Authentication components
│   ├── layouts/         # Layout components
│   ├── modals/          # Modal dialogs
│   ├── providers/       # Provider components
│   └── loading-states/  # Skeleton loaders
├── contexts/            # React Context providers
│   ├── auth-context.tsx
│   ├── call-queue-context.tsx
│   ├── agents-context.tsx
│   └── data-management-context.tsx
├── lib/                 # Utilities and helpers
│   ├── utils.ts         # Common utilities (cn function)
│   ├── mock-data.ts     # Mock data for development
│   ├── local-storage.ts # Storage utilities
│   └── date-utils.ts    # Date formatting
├── welcome/             # Welcome page assets
├── root.tsx            # Root layout component
├── routes.ts           # Route configuration
└── app.css            # Global styles

## Key Configuration Files
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite bundler configuration
- `react-router.config.ts` - React Router SSR config
- `tailwind.config.ts` - TailwindCSS configuration
- `components.json` - shadcn/ui configuration
- `Dockerfile` - Container configuration
- `pnpm-lock.yaml` - Lock file for pnpm

## Documentation Files
- `README.md` - Project documentation
- `CLAUDE.md` - Claude AI guidance
- `implementation.md` - Implementation roadmap
- `shad-cn.md` - shadcn component details