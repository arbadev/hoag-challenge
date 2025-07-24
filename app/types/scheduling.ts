// Shared types for scheduling functionality

export interface Provider {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  status: 'active' | 'inactive';
  joinedAt: string;
  totalHoursWorked?: number;
  reliabilityScore?: number; // 0-100
}

export interface AvailabilitySlot {
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

export interface Shift {
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

export interface ApprovalRequest {
  id: string;
  availabilitySlot: AvailabilitySlot;
  provider: Provider;
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  decision?: 'approved' | 'rejected';
  decisionNotes?: string;
}

export interface ScheduleConflict {
  id: string;
  type: 'overlap' | 'understaffed' | 'overstaffed';
  date: string;
  timeRange: {
    start: string;
    end: string;
  };
  affectedProviders: string[];
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface DepartmentStats {
  department: string;
  totalProviders: number;
  totalShiftsThisWeek: number;
  totalHoursThisWeek: number;
  coveragePercentage: number;
  pendingRequests: number;
}

export interface SystemStats {
  totalProviders: number;
  activeProviders: number;
  totalShiftsThisWeek: number;
  totalHoursThisWeek: number;
  pendingApprovals: number;
  coverageGaps: number;
  departmentStats: DepartmentStats[];
}