# MVP Implementation Plan - Scheduling App
## Resume
Scheduling App Prototype Overview
This prototype is a basic scheduling platform designed to streamline provider availability and admin scheduling. It includes the following core features:
* User Authentication & Roles Providers and admins can log in with basic role-based access control. Providers access availability features, while admins access scheduling tools.
* Provider Availability Input Providers can log in and specify their available time slots for the week (e.g., Mondays 9am–12pm, Fridays 1pm–4pm). This serves as a proposal for future scheduling.
* Admin Scheduling Interface Admins can view all submitted availability and select which slots to accept or reject. Accepted slots are assigned to specific days and hours on the calendar.
* Weekly Provider Calendar The final output is a simple calendar view where provider shifts are distributed across the week based on approved availability.
This prototype focuses on minimal but essential functionality to demonstrate the scheduling flow from provider input to admin-approve

## Overview
A minimal viable product with role-based authentication and two main screens (admin/provider).

## Architecture Decisions
- **Authentication**: Mock auth using localStorage
- **Routing**: React Router with protected routes
- **UI Library**: Shadcn UI (minimal components)
- **State Management**: Local state only (no context needed for MVP)
- **Styling**: Tailwind CSS with Shadcn components

## File Structure
```
src/
├── components/
│   ├── ui/                    # Shadcn components
│   │   ├── button.tsx        # Button component
│   │   └── card.tsx          # Card component
│   └── PageLayout.tsx        # Shared page layout wrapper
│
├── lib/
│   ├── utils.ts              # Tailwind merge utility
│   └── mockAuth.ts           # Mock authentication service
│
├── routes/
│   ├── root.tsx              # Root route with outlet
│   ├── login.tsx             # Login page with role selection
│   ├── provider.tsx          # Provider main page (protected)
│   └── admin.tsx             # Admin main page (protected)
│
└── main.tsx                  # Router configuration
```

## Implementation Phases

### Phase 1: Foundation Setup (1 hour)

#### 1.1 Project Initialization
- Initialize React Router project
- Install Shadcn UI with stone color theme
- Configure path aliases (~/ for src/)
- Setup Tailwind CSS

#### 1.2 Required Dependencies
```
Dependencies to install:
- lucide-react (for icons)
- clsx (for conditional classes)
- tailwind-merge (for merging Tailwind classes)
```

#### 1.3 Shadcn Components Needed
```
Components to add via Shadcn CLI:
- button
- card
```

### Phase 2: Core Utilities (30 minutes)

#### 2.1 Mock Authentication Service (`lib/mockAuth.ts`)
**Purpose**: Simulate user authentication without backend

**Functionality**:
- Store user data in localStorage
- Provide login function that accepts role parameter
- Provide logout function that clears storage
- Provide getCurrentUser function to check auth status

**Data Structure**:
```
User object:
- id: string
- name: string  
- role: 'admin' | 'provider'
```

#### 2.2 Utility Functions (`lib/utils.ts`)
**Purpose**: Tailwind class merging utility
- cn() function for conditional class names

### Phase 3: Routing Structure (45 minutes)

#### 3.1 Root Route (`routes/root.tsx`)
**Purpose**: App wrapper with outlet
**Functionality**: 
- Renders child routes via Outlet
- No authentication check at this level

#### 3.2 Router Configuration (`main.tsx`)
**Route Structure**:
```
/           → Redirects to /login
/login      → Login page (public)
/provider   → Provider main page (protected)
/admin      → Admin main page (protected)
```

**Protection Strategy**:
- Check auth status on component mount
- Redirect to login if not authenticated
- Redirect to login if wrong role

### Phase 4: Login Implementation (1 hour)

#### 4.1 Login Page (`routes/login.tsx`)
**Purpose**: Role selection interface

**Components**:
- Page container with centered content
- Title: "Scheduling App"
- Subtitle: "Choose your role to continue"
- Two role selection cards

**Role Cards Structure**:
1. Admin Card
   - Icon: Users (from lucide-react)
   - Title: "Admin"
   - Description: "Manage schedules"
   - Color accent: Blue
   - Click action: Login as admin, navigate to /admin

2. Provider Card
   - Icon: UserCheck (from lucide-react)
   - Title: "Provider"
   - Description: "Submit availability"
   - Color accent: Green
   - Click action: Login as provider, navigate to /provider

**Styling Requirements**:
- Centered layout
- Max width container (md)
- Card hover effects
- Responsive design

### Phase 5: Protected Pages (1 hour)

#### 5.1 Page Layout Component (`components/PageLayout.tsx`)
**Purpose**: Shared layout for authenticated pages

**Structure**:
- Header with:
  - App title
  - Current user name
  - User role badge
  - Logout button
- Main content area with padding
- Consistent styling

**Props**:
- title: string (page title)
- children: React nodes

#### 5.2 Provider Page (`routes/provider.tsx`)
**Purpose**: Main provider interface

**Protection**: 
- Check if user is authenticated
- Check if user role is 'provider'
- Redirect to login if checks fail

**Content Structure**:
- Use PageLayout wrapper
- Welcome message with provider name
- Placeholder content:
  - "Availability Management" section
  - "Your upcoming shifts" section
  - Empty state messages

**Visual Elements**:
- Cards for different sections
- Provider-specific color theme (green accents)

#### 5.3 Admin Page (`routes/admin.tsx`)
**Purpose**: Main admin interface

**Protection**:
- Check if user is authenticated
- Check if user role is 'admin'
- Redirect to login if checks fail

**Content Structure**:
- Use PageLayout wrapper
- Welcome message with admin name
- Placeholder content:
  - "Schedule Overview" section
  - "Pending Approvals" section
  - "Provider List" section

**Visual Elements**:
- Cards for different sections
- Admin-specific color theme (blue accents)

### Phase 6: Navigation Flow (30 minutes)

#### 6.1 Authentication Flow
```
User lands on app (/)
  ↓
Redirect to /login
  ↓
User selects role (Admin/Provider)
  ↓
Mock login stores user in localStorage
  ↓
Navigate to role-specific page
```

#### 6.2 Protected Route Logic
```
User tries to access /admin or /provider
  ↓
Check localStorage for user
  ↓
If no user → Redirect to /login
  ↓
If wrong role → Redirect to /login
  ↓
If correct role → Show page
```

#### 6.3 Logout Flow
```
User clicks logout button
  ↓
Clear localStorage
  ↓
Navigate to /login
```

## Component Specifications

### Login Page Components
- **Container**: Flexbox center, min-height screen, gray background
- **Content Wrapper**: Max width medium, vertical spacing
- **Title Section**: Text center, large heading, subtitle
- **Role Cards**: Interactive cards with hover state, icon + text

### Protected Page Components
- **Header**: Flex between, app branding left, user info right
- **User Badge**: Shows role with colored background
- **Logout Button**: Secondary style, right aligned
- **Content Grid**: Responsive grid for content cards
- **Section Cards**: White background, padding, shadows

## Styling Guidelines

### Color Scheme
- **Background**: Gray-50 (login), White (main pages)
- **Admin Theme**: Blue-600 accents
- **Provider Theme**: Green-600 accents
- **Neutral**: Stone/Gray palette
- **Interactive**: Hover states on all clickable elements

### Spacing System
- Page padding: 6-8 units
- Card padding: 4-6 units
- Element spacing: 4 units
- Section spacing: 8 units

### Typography
- Page titles: 3xl, bold
- Section titles: xl, semibold
- Body text: base, normal
- Descriptive text: sm, gray-600

## Testing Checklist

### Phase 1-2 Verification
- [ ] Project runs without errors
- [ ] Shadcn components installed
- [ ] Mock auth functions work in console

### Phase 3-4 Verification
- [ ] Login page displays correctly
- [ ] Both role cards are clickable
- [ ] Role selection stores user in localStorage
- [ ] Navigation happens after role selection

### Phase 5-6 Verification
- [ ] Provider page only accessible when logged in as provider
- [ ] Admin page only accessible when logged in as admin
- [ ] Wrong role redirects to login
- [ ] Logout clears session and redirects
- [ ] User info displays in header

## Success Criteria
1. User can select a role and "login"
2. Each role sees only their designated page
3. Unauthorized access redirects to login
4. Logout functionality works
5. Clean, professional UI appearance
6. Responsive on mobile and desktop

## Time Estimate
- Total implementation: 4-5 hours
- Setup and configuration: 1 hour
- Core functionality: 2-3 hours
- Styling and polish: 1 hour

## Next Steps After MVP
1. Add real authentication
2. Implement actual scheduling features
3. Add data persistence
4. Create detailed provider/admin interfaces
5. Add more Shadcn components as needed