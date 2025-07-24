# Project Overview

## Project Name
hoag-challenge - Call Center Management System

## Purpose
A full-stack React application for managing call center operations with role-based access control. The system provides separate interfaces for:
- **Agents**: Can view and manage call queues, handle assignments
- **Admins**: Full access including agent management, analytics, and system configuration

## Key Features
- Real-time call queue management
- Agent assignment and availability tracking
- Call priority and escalation system
- Department-based routing
- Analytics dashboard
- Mobile-responsive design

## Architecture
- **Frontend**: React 19 with React Router v7 for SSR
- **State Management**: Context API with multiple providers (Auth, CallQueue, Agents, DataManagement)
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: TailwindCSS v4 with CSS-in-JS support
- **Build Tool**: Vite with TypeScript

## Project Status
Currently in development with completed modal system, queue management, and notification features. Authentication and core layout components are pending implementation.