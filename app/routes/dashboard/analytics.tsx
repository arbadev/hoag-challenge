import { ProtectedRoute } from "~/components/protected-route"
import { MainLayout } from "~/components/layouts/main-layout"

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div>
          <h1 className="text-2xl font-bold mb-4">Analytics</h1>
          <p className="text-muted-foreground">
            Analytics dashboard coming soon...
          </p>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}

export function meta() {
  return [
    { title: "Analytics - Call Center Management" },
    { name: "description", content: "Call center analytics" },
  ]
}