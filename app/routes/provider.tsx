import { useEffect } from "react";
import { useNavigate } from "react-router";
import { PageLayout } from "~/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { useAuth } from "~/lib/useAuth";
import { Calendar, Clock } from "lucide-react";

export default function ProviderPage() {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated, hasRole } = useAuth();

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

  return (
    <PageLayout title="Provider Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {user.name}
          </h2>
          <p className="text-gray-600">Manage your availability and view your scheduled shifts</p>
        </div>

        <Card className="border-green-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <CardTitle>Availability Management</CardTitle>
            </div>
            <CardDescription>
              Submit your available time slots for scheduling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription className="text-gray-600">
                Availability submission feature coming soon. You'll be able to specify your preferred working hours here.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              <CardTitle>Your Upcoming Shifts</CardTitle>
            </div>
            <CardDescription>
              View your confirmed schedule for the week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription className="text-gray-600">
                No shifts scheduled yet. Your approved shifts will appear here once confirmed by an admin.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}