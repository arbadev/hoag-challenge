import { Navigate } from "react-router"
import { ProtectedRoute } from "~/components/protected-route"

export default function DashboardRedirect() {
  return (
    <ProtectedRoute>
      <Navigate to="/dashboard/home" replace />
    </ProtectedRoute>
  )
}

export function meta() {
  return [
    { title: "Dashboard - Call Center Management" },
    { name: "description", content: "Call Center Management Dashboard" },
  ]
}