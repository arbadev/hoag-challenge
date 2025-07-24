import { useNavigate } from "react-router";
import { Users, UserCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { useAuth } from "~/lib/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRoleSelect = (role: 'admin' | 'provider') => {
    login(role);
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Scheduling App</h1>
          <p className="text-gray-600">Choose your role to continue</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card 
            className="cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md"
            onClick={() => handleRoleSelect('admin')}
          >
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Admin</CardTitle>
              <CardDescription>Manage schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Access scheduling tools and manage provider availability
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md"
            onClick={() => handleRoleSelect('provider')}
          >
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <UserCheck className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle className="text-xl">Provider</CardTitle>
              <CardDescription>Submit availability</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Submit your availability and view your assigned shifts
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}