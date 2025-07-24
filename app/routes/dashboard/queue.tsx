import { ProtectedRoute } from "~/components/protected-route"
import { MainLayout } from "~/components/layouts/main-layout"

export default function QueuePage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div>
          <h1 className="text-2xl font-bold mb-4">Call Queue</h1>
          <p className="text-muted-foreground">
            Call queue management coming soon...
          </p>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}

export function meta() {
  return [
    { title: "Call Queue - Call Center Management" },
    { name: "description", content: "Manage call queue" },
  ]
}