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

### Provider Features - Detailed Implementation

#### **Availability Management Component**
The core feature allowing providers to submit and manage their available time slots.

##### Components Required:
- **Form** + **Input** + **Select** - Availability submission form
- **DatePicker** - Date selection for availability  
- **Table** - Display submitted availability slots
- **Switch** - Toggle recurring availability
- **Dialog** - Edit/delete confirmation modals
- **Toast** - Success/error notifications
- **TimePicker** (custom) - Time slot selection
- **Badge** - Status indicators (pending/approved/rejected)

##### Data Structure:
```typescript
interface AvailabilitySlot {
  id: string;
  providerId: string;
  date: string; // ISO date
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isRecurring: boolean;
  recurringDays?: number[]; // 0-6 for Sun-Sat
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

##### Features:
1. **Add New Availability**
   - Date picker with min date validation (today onwards)
   - Time range selector with 30-minute intervals
   - Recurring option with day-of-week selector
   - Optional notes field
   - Validation for time conflicts

2. **View/Manage Availability**
   - Sortable table by date/status
   - Filter by status (all/pending/approved/rejected)
   - Edit action (only for pending slots)
   - Delete action with confirmation
   - Bulk delete for multiple selections

3. **Visual Indicators**
   - Color-coded status badges
   - Past dates grayed out
   - Conflict warnings
   - Loading states during submission

#### **Upcoming Shifts Component**
Display confirmed shifts in both calendar and list views.

##### Components Required:
- **Calendar** - Monthly/weekly view toggle
- **Tabs** - Switch between calendar and list views
- **Table** - List view of shifts
- **Popover** - Shift details on hover/click
- **ScrollArea** - For long shift lists
- **Select** - View filter (week/month)

##### Data Structure:
```typescript
interface Shift {
  id: string;
  providerId: string;
  date: string;
  startTime: string;
  endTime: string;
  department?: string;
  location?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}
```

##### Features:
1. **Calendar View**
   - Weekly view by default
   - Color-coded shift blocks
   - Click to view shift details
   - Navigation between weeks/months
   - Today indicator
   - Export to personal calendar

2. **List View**
   - Tabular format with all shift details
   - Sort by date/time/department
   - Filter by date range
   - Print-friendly format
   - CSV export option

3. **Shift Details**
   - Time and duration
   - Department/location info
   - Special instructions
   - Contact information

#### **Provider Dashboard Stats**
Quick overview cards showing key metrics.

##### Components Required:
- **Card** - Stat containers
- **Progress** - Visual progress indicators
- **Skeleton** - Loading states

##### Features:
- Total hours scheduled this week
- Upcoming shifts count
- Pending availability requests
- Approval rate percentage

#### **State Management**
Using React Context for provider data management.

##### Context Structure:
```typescript
interface ProviderContext {
  availability: AvailabilitySlot[];
  shifts: Shift[];
  stats: {
    weeklyHours: number;
    upcomingShifts: number;
    pendingRequests: number;
    approvalRate: number;
  };
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addAvailability: (slot: Omit<AvailabilitySlot, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAvailability: (id: string, updates: Partial<AvailabilitySlot>) => void;
  deleteAvailability: (id: string) => void;
  refreshData: () => void;
}
```

#### **Component Hierarchy**
```
ProviderPage
├── ProviderStats (dashboard metrics)
├── Tabs
│   ├── AvailabilityTab
│   │   ├── AvailabilityForm
│   │   └── AvailabilityTable
│   └── ShiftsTab
│       ├── ViewToggle (calendar/list)
│       ├── ShiftCalendar
│       └── ShiftList
└── Notifications (Toast container)
```

#### **User Flow**
1. Provider logs in → Dashboard with stats
2. Navigate to Availability → View current slots
3. Click "Add Availability" → Form dialog opens
4. Submit form → Toast notification + Table updates
5. Admin approves → Status badge updates
6. Approved slots → Appear in Shifts calendar
7. Export/Print → Generate formatted output

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