import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { PageLayout } from "~/components/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Toaster } from "~/components/ui/sonner";
import { toast } from "sonner";
import { useAuth } from "~/lib/useAuth";
import { Plus } from "lucide-react";

// Provider components
import { ProviderStats } from "~/components/provider/ProviderStats";
import { AvailabilityForm } from "~/components/provider/AvailabilityForm";
import { AvailabilityTable } from "~/components/provider/AvailabilityTable";
import { ShiftCalendar } from "~/components/provider/ShiftCalendar";
import type { AvailabilitySlot, Shift } from "~/types/scheduling";
import { ShiftList } from "~/components/provider/ShiftList";

// Mock data for demonstration
const mockAvailability: AvailabilitySlot[] = [
  {
    id: "1",
    providerId: "provider1",
    date: new Date().toISOString().split('T')[0],
    startTime: "09:00",
    endTime: "17:00",
    isRecurring: false,
    status: "approved",
    notes: "Available for full day",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    providerId: "provider1",
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    startTime: "13:00",
    endTime: "21:00",
    isRecurring: true,
    recurringDays: [1, 3, 5],
    status: "pending",
    notes: "Afternoon shifts preferred",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockShifts: Shift[] = [
  {
    id: "1",
    providerId: "provider1",
    date: new Date().toISOString().split('T')[0],
    startTime: "09:00",
    endTime: "17:00",
    department: "Emergency",
    location: "Building A",
    status: "scheduled",
    notes: "Please arrive 15 minutes early",
  },
  {
    id: "2",
    providerId: "provider1",
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    startTime: "13:00",
    endTime: "21:00",
    department: "ICU",
    location: "Building B",
    status: "scheduled",
  },
];

export default function ProviderPage() {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated, hasRole } = useAuth();
  const [availability, setAvailability] = useState<AvailabilitySlot[]>(mockAvailability);
  const [shifts] = useState<Shift[]>(mockShifts);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  useEffect(() => {
    if (!loading && (!isAuthenticated() || !hasRole('provider'))) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, hasRole, navigate]);

  if (loading) {
    return (
      <PageLayout title="Provider Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </PageLayout>
    );
  }

  if (!user || user.role !== 'provider') {
    return null;
  }

  const handleAddAvailability = (data: any) => {
    if (!data.date) return;
    
    const newSlot: AvailabilitySlot = {
      id: Date.now().toString(),
      providerId: user.id,
      date: data.date.toISOString().split('T')[0],
      startTime: data.startTime,
      endTime: data.endTime,
      isRecurring: data.isRecurring,
      recurringDays: data.recurringDays,
      status: "pending",
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setAvailability([...availability, newSlot]);
    setShowAddDialog(false);
    toast.success("Availability submitted successfully!");
  };

  const handleEditAvailability = (slot: AvailabilitySlot) => {
    setEditingSlot(slot);
    setShowAddDialog(true);
  };

  const handleDeleteAvailability = (id: string) => {
    setAvailability(availability.filter(slot => slot.id !== id));
    toast.success("Availability slot deleted");
  };

  // Calculate stats
  const stats = {
    weeklyHours: shifts.filter(s => s.status === "scheduled").reduce((total, shift) => {
      const start = parseInt(shift.startTime.split(":")[0]);
      const end = parseInt(shift.endTime.split(":")[0]);
      return total + (end - start);
    }, 0),
    upcomingShifts: shifts.filter(s => s.status === "scheduled").length,
    pendingRequests: availability.filter(a => a.status === "pending").length,
    approvalRate: availability.length > 0 
      ? Math.round((availability.filter(a => a.status === "approved").length / availability.length) * 100)
      : 0,
  };

  return (
    <>
      <PageLayout title="Provider Dashboard">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome, {user.name}
            </h2>
            <p className="text-gray-600">Manage your availability and view your scheduled shifts</p>
          </div>

          <ProviderStats {...stats} />

          <Tabs defaultValue="availability" className="space-y-4">
            <TabsList>
              <TabsTrigger value="availability">Availability Management</TabsTrigger>
              <TabsTrigger value="shifts">Your Shifts</TabsTrigger>
            </TabsList>

            <TabsContent value="availability" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Your Availability</h3>
                <Button
                  onClick={() => setShowAddDialog(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Availability
                </Button>
              </div>
              
              <AvailabilityTable
                slots={availability}
                onEdit={handleEditAvailability}
                onDelete={handleDeleteAvailability}
              />
            </TabsContent>

            <TabsContent value="shifts" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Your Shifts</h3>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "calendar" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("calendar")}
                  >
                    Calendar View
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    List View
                  </Button>
                </div>
              </div>
              
              {viewMode === "calendar" ? (
                <ShiftCalendar shifts={shifts} />
              ) : (
                <ShiftList shifts={shifts} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </PageLayout>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingSlot ? "Edit Availability" : "Add Availability"}
            </DialogTitle>
          </DialogHeader>
          <AvailabilityForm
            onSubmit={handleAddAvailability}
            onCancel={() => {
              setShowAddDialog(false);
              setEditingSlot(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Toaster position="top-right" />
    </>
  );
}