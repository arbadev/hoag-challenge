import { useEffect } from "react";
import { useNavigate } from "react-router";
import { PageLayout } from "~/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { useAuth } from "~/lib/useAuth";
import { CalendarDays, CheckCircle, Users } from "lucide-react";

export default function AdminPage() {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated, hasRole } = useAuth();

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
    <PageLayout title="Admin Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {user.name}
          </h2>
          <p className="text-gray-600">Manage provider schedules and approve availability requests</p>
        </div>

        <Card className="border-blue-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-blue-600" />
              <CardTitle>Schedule Overview</CardTitle>
            </div>
            <CardDescription>
              View and manage the weekly schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription className="text-gray-600">
                Schedule management feature coming soon. You'll be able to view and edit the master schedule here.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <CardTitle>Pending Approvals</CardTitle>
            </div>
            <CardDescription>
              Review and approve provider availability requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription className="text-gray-600">
                No pending approvals. Provider availability requests will appear here for your review.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <CardTitle>Provider List</CardTitle>
            </div>
            <CardDescription>
              View all registered providers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription className="text-gray-600">
                Provider management coming soon. You'll be able to view and manage all providers here.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}