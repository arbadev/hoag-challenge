import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { useAuth } from "~/lib/useAuth";

interface PageLayoutProps {
  title: string;
  children: ReactNode;
}

export function PageLayout({ title, children }: PageLayoutProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roleColor = user?.role === 'admin' ? 'bg-blue-600' : 'bg-green-600';

  return (
    <div className="min-h-screen bg-gray-50">
      <Card className="rounded-none border-x-0 border-t-0">
        <div className="h-16 px-6 flex items-center justify-between border-b">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Scheduling App</h1>
            <span className="text-sm text-gray-600">/ {title}</span>
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-sm text-gray-600">{user.name}</span>
                <Badge className={`${roleColor} text-white hover:${roleColor}`}>
                  {user.role}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      <div className="p-6 md:p-8">
        <CardContent className="p-0">
          {children}
        </CardContent>
      </div>
    </div>
  );
}