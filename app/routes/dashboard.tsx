import { Navigate } from "react-router"
import { useAuth } from "~/contexts/auth-context"
import { ProtectedRoute } from "~/components/protected-route"

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">
          Welcome, {user?.name}!
        </h1>
        <p className="text-muted-foreground">
          You are logged in as {user?.role === "admin" ? "an Administrator" : "an Agent"}.
        </p>
        <p className="mt-4">
          Dashboard implementation coming soon...
        </p>
      </div>
    </ProtectedRoute>
  )
}

export function meta() {
  return [
    { title: "Dashboard - Call Center Management" },
    { name: "description", content: "Call Center Management Dashboard" },
  ]
}