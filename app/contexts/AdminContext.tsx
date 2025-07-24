import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Provider, AvailabilitySlot, Shift, ApprovalRequest, SystemStats } from "~/types/scheduling";

interface AdminContextType {
  // Data
  providers: Provider[];
  availabilitySlots: AvailabilitySlot[];
  shifts: Shift[];
  approvalRequests: ApprovalRequest[];
  systemStats: SystemStats;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  approveAvailability: (requestId: string, notes?: string) => void;
  rejectAvailability: (requestId: string, notes?: string) => void;
  assignShift: (shift: Omit<Shift, 'id'>) => void;
  updateShift: (shiftId: string, updates: Partial<Shift>) => void;
  cancelShift: (shiftId: string) => void;
  refreshData: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Mock data generators
const generateMockProviders = (): Provider[] => [
  {
    id: "provider1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    department: "Emergency",
    status: "active",
    joinedAt: "2023-01-15",
    totalHoursWorked: 520,
    reliabilityScore: 95,
  },
  {
    id: "provider2",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "(555) 234-5678",
    department: "ICU",
    status: "active",
    joinedAt: "2023-03-20",
    totalHoursWorked: 380,
    reliabilityScore: 88,
  },
  {
    id: "provider3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "(555) 345-6789",
    department: "Pediatrics",
    status: "active",
    joinedAt: "2023-06-10",
    totalHoursWorked: 240,
    reliabilityScore: 92,
  },
  {
    id: "provider4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    department: "Surgery",
    status: "inactive",
    joinedAt: "2022-11-05",
    totalHoursWorked: 680,
    reliabilityScore: 85,
  },
];

const generateMockAvailability = (): AvailabilitySlot[] => {
  const slots: AvailabilitySlot[] = [];
  const providers = ["provider1", "provider2", "provider3"];
  const statuses: Array<"pending" | "approved" | "rejected"> = ["pending", "approved", "rejected"];
  
  providers.forEach((providerId, index) => {
    // Add some availability for each provider
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i + index * 2);
      
      slots.push({
        id: `avail-${providerId}-${i}`,
        providerId,
        date: date.toISOString().split('T')[0],
        startTime: `${9 + i * 2}:00`,
        endTime: `${17 + i}:00`,
        isRecurring: i === 0,
        recurringDays: i === 0 ? [1, 3, 5] : undefined,
        status: statuses[i % 3],
        notes: i === 0 ? "Preferred morning shifts" : undefined,
        createdAt: new Date(Date.now() - 86400000 * (3 - i)).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * (3 - i)).toISOString(),
      });
    }
  });
  
  return slots;
};

const generateMockShifts = (): Shift[] => {
  const shifts: Shift[] = [];
  const providers = ["provider1", "provider2", "provider3"];
  const departments = ["Emergency", "ICU", "Pediatrics"];
  
  providers.forEach((providerId, provIndex) => {
    for (let i = 0; i < 4; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      shifts.push({
        id: `shift-${providerId}-${i}`,
        providerId,
        date: date.toISOString().split('T')[0],
        startTime: `${8 + (i % 2) * 4}:00`,
        endTime: `${16 + (i % 2) * 4}:00`,
        department: departments[provIndex],
        location: `Building ${String.fromCharCode(65 + provIndex)}`,
        status: i < 3 ? "scheduled" : "completed",
        notes: i === 0 ? "Please arrive 15 minutes early" : undefined,
      });
    }
  });
  
  return shifts;
};

export function AdminProvider({ children }: { children: ReactNode }) {
  const [providers] = useState<Provider[]>(generateMockProviders());
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>(generateMockAvailability());
  const [shifts, setShifts] = useState<Shift[]>(generateMockShifts());
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // Generate approval requests from pending availability
  const approvalRequests: ApprovalRequest[] = availabilitySlots
    .filter(slot => slot.status === "pending")
    .map(slot => ({
      id: `request-${slot.id}`,
      availabilitySlot: slot,
      provider: providers.find(p => p.id === slot.providerId)!,
      requestedAt: slot.createdAt,
    }));

  // Calculate system stats
  const systemStats: SystemStats = {
    totalProviders: providers.length,
    activeProviders: providers.filter(p => p.status === "active").length,
    totalShiftsThisWeek: shifts.filter(s => s.status === "scheduled").length,
    totalHoursThisWeek: shifts
      .filter(s => s.status === "scheduled")
      .reduce((total, shift) => {
        const start = parseInt(shift.startTime.split(":")[0]);
        const end = parseInt(shift.endTime.split(":")[0]);
        return total + (end - start);
      }, 0),
    pendingApprovals: approvalRequests.length,
    coverageGaps: 2, // Mock value
    departmentStats: [
      {
        department: "Emergency",
        totalProviders: 1,
        totalShiftsThisWeek: 4,
        totalHoursThisWeek: 32,
        coveragePercentage: 85,
        pendingRequests: 1,
      },
      {
        department: "ICU",
        totalProviders: 1,
        totalShiftsThisWeek: 4,
        totalHoursThisWeek: 32,
        coveragePercentage: 90,
        pendingRequests: 1,
      },
      {
        department: "Pediatrics",
        totalProviders: 1,
        totalShiftsThisWeek: 4,
        totalHoursThisWeek: 32,
        coveragePercentage: 75,
        pendingRequests: 1,
      },
    ],
  };

  const approveAvailability = (requestId: string, notes?: string) => {
    const request = approvalRequests.find(r => r.id === requestId);
    if (request) {
      setAvailabilitySlots(prev =>
        prev.map(slot =>
          slot.id === request.availabilitySlot.id
            ? { ...slot, status: "approved", updatedAt: new Date().toISOString() }
            : slot
        )
      );
      
      // Create a shift from approved availability
      const newShift: Shift = {
        id: `shift-${Date.now()}`,
        providerId: request.availabilitySlot.providerId,
        date: request.availabilitySlot.date,
        startTime: request.availabilitySlot.startTime,
        endTime: request.availabilitySlot.endTime,
        department: request.provider.department,
        status: "scheduled",
        notes: notes,
      };
      setShifts(prev => [...prev, newShift]);
    }
  };

  const rejectAvailability = (requestId: string, _notes?: string) => {
    const request = approvalRequests.find(r => r.id === requestId);
    if (request) {
      setAvailabilitySlots(prev =>
        prev.map(slot =>
          slot.id === request.availabilitySlot.id
            ? { ...slot, status: "rejected", updatedAt: new Date().toISOString() }
            : slot
        )
      );
    }
  };

  const assignShift = (shift: Omit<Shift, 'id'>) => {
    const newShift: Shift = {
      ...shift,
      id: `shift-${Date.now()}`,
    };
    setShifts(prev => [...prev, newShift]);
  };

  const updateShift = (shiftId: string, updates: Partial<Shift>) => {
    setShifts(prev =>
      prev.map(shift =>
        shift.id === shiftId ? { ...shift, ...updates } : shift
      )
    );
  };

  const cancelShift = (shiftId: string) => {
    setShifts(prev =>
      prev.map(shift =>
        shift.id === shiftId ? { ...shift, status: "cancelled" } : shift
      )
    );
  };

  const refreshData = () => {
    // In a real app, this would fetch fresh data from the server
    console.log("Refreshing admin data...");
  };

  const value: AdminContextType = {
    providers,
    availabilitySlots,
    shifts,
    approvalRequests,
    systemStats,
    isLoading,
    error,
    approveAvailability,
    rejectAvailability,
    assignShift,
    updateShift,
    cancelShift,
    refreshData,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}