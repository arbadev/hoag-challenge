import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from "~/components/ui/hover-card"
import { Badge } from "~/components/ui/badge"
import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import { Separator } from "~/components/ui/separator"
import type { Call, Agent } from "~/lib/mock-data"
import { formatDate, formatTime } from "~/lib/date-utils"
import { 
  Phone, 
  Clock, 
  User, 
  Building2, 
  AlertCircle,
  Calendar
} from "lucide-react"

interface CallHoverCardProps {
  call: Call
  assignedAgent?: Agent | null
  children: React.ReactNode
}

export function CallHoverCard({ call, assignedAgent, children }: CallHoverCardProps) {
  const formattedDate = formatDate(call.createdAt)
  const formattedTime = formatTime(call.createdAt)

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-3">
          {/* Patient Info */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h4 className="font-semibold">{call.patientName}</h4>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {call.phoneNumber}
              </p>
            </div>
            <Badge 
              variant={
                call.priority === "high" ? "destructive" : 
                call.priority === "medium" ? "default" : 
                "secondary"
              }
            >
              {call.priority}
            </Badge>
          </div>

          <Separator />

          {/* Call Details */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Building2 className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium">Department:</span>
              <span>{call.department}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium">Wait Time:</span>
              <span className="text-orange-600 font-mono">
                {Math.floor(call.waitTime / 60)}:{(call.waitTime % 60).toString().padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium">Created:</span>
              <span>{formattedTime}</span>
            </div>

            <div className="flex items-center gap-2">
              <User className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium">Status:</span>
              <span>{call.patientStatus}</span>
            </div>
          </div>

          <Separator />

          {/* Reason */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <AlertCircle className="h-3 w-3 text-muted-foreground" />
              Call Reason
            </div>
            <p className="text-sm text-muted-foreground">
              {call.reason}
            </p>
          </div>

          {/* Assignment Info */}
          {assignedAgent && (
            <>
              <Separator />
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {assignedAgent.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <span className="font-medium">Assigned to:</span>{' '}
                  <span>{assignedAgent.name}</span>
                </div>
              </div>
            </>
          )}

          {/* Escalation Note */}
          {call.escalationNote && (
            <>
              <Separator />
              <div className="space-y-1">
                <p className="text-sm font-medium text-destructive">
                  Escalation Note
                </p>
                <p className="text-sm text-muted-foreground">
                  {call.escalationNote}
                </p>
              </div>
            </>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}