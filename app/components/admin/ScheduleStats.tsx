import { Users, Clock, Calendar, AlertTriangle, TrendingUp, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Badge } from "~/components/ui/badge";
import type { SystemStats } from "~/types/scheduling";

interface ScheduleStatsProps {
  stats: SystemStats;
}

export function ScheduleStats({ stats }: ScheduleStatsProps) {
  const coverageHealth = stats.coverageGaps === 0 ? "excellent" : stats.coverageGaps < 3 ? "good" : "needs attention";
  
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Providers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProviders}/{stats.totalProviders}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.activeProviders / stats.totalProviders) * 100)}% active
            </p>
            <Progress 
              value={(stats.activeProviders / stats.totalProviders) * 100} 
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Coverage</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHoursThisWeek}h</div>
            <p className="text-xs text-muted-foreground">
              Across {stats.totalShiftsThisWeek} shifts
            </p>
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600">+12% from last week</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
            {stats.pendingApprovals > 0 && (
              <Badge variant="secondary" className="mt-2 text-xs">
                Action required
              </Badge>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coverage Health</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.coverageGaps}</div>
            <p className="text-xs text-muted-foreground">Coverage gaps</p>
            <Badge 
              variant={coverageHealth === "excellent" ? "default" : coverageHealth === "good" ? "secondary" : "destructive"}
              className="mt-2 text-xs gap-1"
            >
              {coverageHealth === "excellent" && <CheckCircle className="h-3 w-3" />}
              {coverageHealth === "good" && <AlertTriangle className="h-3 w-3" />}
              {coverageHealth === "needs attention" && <AlertTriangle className="h-3 w-3" />}
              {coverageHealth}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Department Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.departmentStats.map((dept) => (
              <div key={dept.department} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{dept.department}</span>
                    <Badge variant="outline" className="text-xs">
                      {dept.totalProviders} providers
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-600">
                    {dept.totalHoursThisWeek}h / {dept.totalShiftsThisWeek} shifts
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={dept.coveragePercentage} className="flex-1" />
                  <span className="text-sm font-medium w-12 text-right">
                    {dept.coveragePercentage}%
                  </span>
                </div>
                {dept.pendingRequests > 0 && (
                  <p className="text-xs text-yellow-600">
                    {dept.pendingRequests} pending request{dept.pendingRequests > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}