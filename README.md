# Call Center Management System

A modern, full-stack React application for managing call center operations with role-based access control, real-time queue management, and comprehensive analytics.

[![Built with React Router v7](https://img.shields.io/badge/React%20Router-v7-blue)](https://reactrouter.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-blue)](https://tailwindcss.com/)

## 🚀 Features

### For Agents
- **Real-time Call Queue**: View and manage incoming calls with live updates
- **Call Assignment**: Accept and handle call assignments
- **Priority Management**: See call priorities and escalation status
- **Department Filtering**: Filter calls by department
- **Call Details**: Access comprehensive call information

### For Administrators
- **Agent Management**: Monitor agent availability and performance
- **Queue Analytics**: Real-time metrics and statistics
- **Call Escalation**: Handle escalated calls and priority changes
- **System Overview**: Dashboard with key performance indicators
- **Advanced Filtering**: Multi-criteria queue filtering

### Technical Features
- 🔄 **Server-Side Rendering** with React Router v7
- 🎨 **Modern UI** with shadcn/ui components
- 📱 **Responsive Design** for mobile and desktop
- 🔒 **Role-Based Access Control**
- 💾 **Local Storage Persistence**
- ⚡ **Hot Module Replacement** for development
- 🎯 **TypeScript** for type safety

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with React Router v7
- **Language**: TypeScript 5.8
- **Styling**: TailwindCSS v4 + shadcn/ui
- **Build Tool**: Vite 6.3
- **Package Manager**: pnpm
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📦 Installation

### Prerequisites
- Node.js 20 or higher
- pnpm (recommended) or npm

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd hoag-challenge
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Start the development server:
```bash
pnpm dev
# or
npm run dev
```

Your application will be available at `http://localhost:5173`.

## 🎯 Getting Started

### Development

Start the development server with Hot Module Replacement:

```bash
pnpm dev
```

### Type Checking

Run TypeScript type checking:

```bash
pnpm typecheck
```

### Building for Production

Create an optimized production build:

```bash
pnpm build
```

### Running Production Build

Start the production server:

```bash
pnpm start
```

## 📁 Project Structure

```
hoag-challenge/
├── app/                    # Application source code
│   ├── routes/            # Page components (file-based routing)
│   ├── components/        # Reusable components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── auth/         # Authentication components
│   │   ├── layouts/      # Layout components
│   │   └── modals/       # Modal dialogs
│   ├── contexts/         # React Context providers
│   ├── lib/             # Utilities and helpers
│   └── root.tsx         # Root layout component
├── public/              # Static assets
├── build/              # Production build output
└── Configuration files
```

## 🔐 Authentication

The application supports two user roles:

1. **Agent**: Standard user with access to call queue and basic features
2. **Admin**: Full access including agent management and analytics

Login credentials are managed through the authentication context and persisted in local storage.

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) for UI components, built on top of Radix UI primitives. Components include:

- Cards, Buttons, Forms
- Modals, Dialogs, Sheets
- Tables with sorting and filtering
- Toast notifications
- Loading skeletons
- Context menus
- And more...

## 🚀 Deployment

### Docker Deployment

Build and run using Docker:

```bash
# Build the image
docker build -t call-center-app .

# Run the container
docker run -p 3000:3000 call-center-app
```

The application includes a multi-stage Dockerfile optimized for production deployment.

### Platform Support

The containerized application can be deployed to:
- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway
- Any platform supporting Docker containers

### DIY Deployment

For manual deployment, ensure you deploy the build output:

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## 🧪 Development Guidelines

### Code Style
- Use functional components with TypeScript
- Follow the established file naming convention (kebab-case)
- Utilize the `cn()` utility for conditional classes
- Implement proper loading and error states

### State Management
- Global state via React Context API
- Local storage for data persistence
- Optimistic UI updates for better UX

### Best Practices
- Mobile-first responsive design
- Accessibility with ARIA labels
- Keyboard navigation support
- Performance optimization with code splitting

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

Please follow the established code patterns and conventions when contributing. Run `pnpm typecheck` before submitting changes.

---

Built with ❤️ using React Router v7, React 19, and modern web technologies.
