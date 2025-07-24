import { ProtectedRoute } from "~/components/protected-route"
import { MainLayout } from "~/components/layouts/main-layout"

export default function AgentsPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div>
          <h1 className="text-2xl font-bold mb-4">Agent Management</h1>
          <p className="text-muted-foreground">
            Agent management coming soon...
          </p>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}

export function meta() {
  return [
    { title: "Agents - Call Center Management" },
    { name: "description", content: "Manage agents" },
  ]
}