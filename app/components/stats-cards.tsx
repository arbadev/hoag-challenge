import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Phone, Users, Clock, AlertCircle } from "lucide-react"
import { formatWaitTime } from "~/lib/mock-data"
import { useCallQueue } from "~/contexts/call-queue-context"
import { useAgents } from "~/contexts/agents-context"

export function StatsCards() {
  const { stats } = useCallQueue()
  const { agents } = useAgents()

  const availableAgents = agents.filter(a => a.status === 'available').length
  const busyAgents = agents.filter(a => a.status === 'busy').length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
          <Phone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            Active in the system
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Waiting Calls</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.waiting}</div>
          <p className="text-xs text-muted-foreground">
            Avg wait: {formatWaitTime(stats.avgWaitTime)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">High Priority</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.highPriority}</div>
          <p className="text-xs text-muted-foreground">
            Require immediate attention
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Agent Status</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {availableAgents} Available
            </Badge>
            <Badge variant="default" className="text-xs">
              {busyAgents} Busy
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {agents.length} total agents
          </p>
        </CardContent>
      </Card>
    </div>
  )
}