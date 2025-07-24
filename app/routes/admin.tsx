import { useEffect } from "react";
import { useNavigate } from "react-router";
import { PageLayout } from "~/components/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Toaster } from "~/components/ui/sonner";
import { useAuth } from "~/lib/useAuth";
import { AdminProvider, useAdmin } from "~/contexts/AdminContext";
import { CalendarDays, CheckCircle, Users, BarChart3 } from "lucide-react";

// Admin components
import { ScheduleStats } from "~/components/admin/ScheduleStats";
import { AdminScheduleCalendar } from "~/components/admin/AdminScheduleCalendar";
import { ApprovalQueue } from "~/components/admin/ApprovalQueue";
import { ProviderDirectory } from "~/components/admin/ProviderDirectory";

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated, hasRole } = useAuth();
  const {
    providers,
    availabilitySlots,
    shifts,
    approvalRequests,
    systemStats,
    approveAvailability,
    rejectAvailability,
    updateShift,
    cancelShift,
  } = useAdmin();

  useEffect(() => {
    if (!loading && (!isAuthenticated() || !hasRole('admin'))) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, hasRole, navigate]);

  if (loading) {
    return (
      <PageLayout title="Admin Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </PageLayout>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <>
      <PageLayout title="Admin Dashboard">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome, {user.name}
            </h2>
            <p className="text-gray-600">Manage provider schedules and approve availability requests</p>
          </div>

          <ScheduleStats stats={systemStats} />

          <Tabs defaultValue="schedule" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="schedule" className="gap-2">
                <CalendarDays className="h-4 w-4" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="approvals" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Approvals
                {approvalRequests.length > 0 && (
                  <span className="ml-1 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                    {approvalRequests.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="providers" className="gap-2">
                <Users className="h-4 w-4" />
                Providers
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="schedule" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Weekly Schedule Overview</h3>
                <p className="text-sm text-gray-600 mb-4">
                  View and manage all provider schedules. Click on any day to add shifts or drag to reschedule.
                </p>
              </div>
              <AdminScheduleCalendar
                shifts={shifts}
                providers={providers}
                onShiftUpdate={updateShift}
                onShiftCancel={cancelShift}
                onAddShift={(date) => {
                  console.log("Add shift for date:", date);
                  // In a real app, this would open a modal to create a new shift
                }}
              />
            </TabsContent>

            <TabsContent value="approvals" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Pending Approval Requests</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Review and approve provider availability requests. Check for conflicts before approving.
                </p>
              </div>
              <ApprovalQueue
                requests={approvalRequests}
                existingShifts={shifts}
                onApprove={approveAvailability}
                onReject={rejectAvailability}
              />
            </TabsContent>

            <TabsContent value="providers" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Provider Directory</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Manage all registered providers, view their performance metrics, and contact information.
                </p>
              </div>
              <ProviderDirectory
                providers={providers}
                shifts={shifts}
                availability={availabilitySlots}
                onProviderStatusChange={(providerId, status) => {
                  console.log(`Change provider ${providerId} status to ${status}`);
                  // In a real app, this would update the provider status
                }}
              />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900">Analytics Coming Soon</p>
                <p className="text-gray-500 mt-2">
                  Detailed insights and reports will be available here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageLayout>

      <Toaster position="top-right" />
    </>
  );
}

export default function AdminPage() {
  return (
    <AdminProvider>
      <AdminDashboard />
    </AdminProvider>
  );
}