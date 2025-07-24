# Implementation Plan - Scheduling App UI Components

## MVP Component Structure using shadcn/ui

### **Phase 1: Core Components to Install**
```bash
# Required shadcn components for MVP
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add alert
```

### **Phase 2: Authentication Components**

#### Login Page (`/login`)
- **Card** - Container for each role selection option
- **Button** - Clickable element inside each card
- **Lucide Icons**:
  - `Users` - Admin card icon
  - `UserCheck` - Provider card icon

### **Phase 3: Layout Components**

#### PageLayout Wrapper
- **Card** - Main content container
- **Badge** - User role indicator (shows "Admin" or "Provider")
- **Button** - Logout action (secondary variant)

### **Phase 4: Provider Interface Components**

#### Provider Dashboard (`/provider`)
- **Card** - Section containers:
  - Availability Management section
  - Your upcoming shifts section
- **Alert** - Empty state messages for each section

### **Phase 5: Admin Interface Components**

#### Admin Dashboard (`/admin`)
- **Card** - Section containers:
  - Schedule Overview section
  - Pending Approvals section
  - Provider List section
- **Alert** - Empty state messages for each section

## MVP Style Guidelines

### Color Theming
- **Background**: Gray-50 (login page), White (main pages)
- **Admin Theme**: Blue-600 accents for badges and hover states
- **Provider Theme**: Green-600 accents for badges and hover states
- **Neutral**: Stone/Gray palette for borders and secondary text

### Responsive Design
- Login cards: Horizontal on desktop, stack vertically on mobile
- PageLayout: Adjusts padding (p-6 desktop, p-4 mobile)
- Section cards: Full width with responsive grid gaps

### Component Specifications

#### Role Selection Cards (Login)
- Width: max-w-sm per card
- Padding: p-6
- Hover: transform scale(1.02) with transition
- Shadow: shadow-md on hover
- Cursor: pointer

#### Page Header (PageLayout)
- Height: h-16
- Display: flex justify-between items-center
- Border: border-b

#### Content Cards
- Background: bg-white
- Border: border rounded-lg
- Padding: p-6
- Margin: space-y-4 between cards

#### Empty State Alerts
- Variant: default (neutral styling)
- Text: Muted color for empty state messages

## Future Enhancement Components (Post-MVP)

### Provider Features
- **Form** + **Input** + **Select** - Availability submission form
- **DatePicker** - Date selection for availability
- **Table** - Display submitted availability slots
- **Switch** - Toggle recurring availability

### Admin Features
- **Table** - Provider availability management
- **Tabs** - View switching (Overview, Approvals, Schedule)
- **Calendar** - Weekly schedule visualization
- **ScrollArea** - Long provider lists
- **Popover** - Quick actions on calendar
- **Dialog** - Confirmation modals for approve/reject

### Enhanced UI Elements
- **Toast** - Success/error notifications
- **Skeleton** - Loading states
- **Avatar** - User profile pictures
- **DropdownMenu** - Extended user menu
- **Sheet** - Mobile navigation drawer
- **Separator** - Visual section breaks
- **Checkbox** - Bulk selection
- **NavigationMenu** - Desktop navigation
- **Breadcrumb** - Page hierarchy

## Implementation Notes

1. **MVP Focus**: Only install and use components listed in Phases 1-5
2. **Mock Data**: All content is static placeholder text for MVP
3. **No Backend**: Authentication uses localStorage only
4. **Minimal Interactivity**: Only login role selection and logout functionality
5. **Future-Ready**: Structure allows easy addition of enhanced components later