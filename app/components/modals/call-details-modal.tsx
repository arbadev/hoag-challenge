import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "~/components/ui/sheet"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Separator } from "~/components/ui/separator"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import { useAgents } from "~/contexts/agents-context"
import type { Call } from "~/lib/mock-data"
import { 
  Phone, 
  Clock, 
  User, 
  Building2, 
  AlertCircle, 
  Calendar,
  FileText,
  ArrowRight
} from "lucide-react"

interface CallDetailsModalProps {
  call: Call | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssign?: () => void
  onTransfer?: () => void
  onEscalate?: () => void
}

export function CallDetailsModal({ 
  call, 
  open, 
  onOpenChange,
  onAssign,
  onTransfer,
  onEscalate
}: CallDetailsModalProps) {
  const { agents } = useAgents()

  if (!call) return null

  const assignedAgent = call.assignedTo ? agents.find(a => a.id === call.assignedTo) : null
  const createdDate = new Date(call.createdAt)
  const formattedDate = createdDate.toLocaleDateString()
  const formattedTime = createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[480px]">
        <SheetHeader>
          <SheetTitle>Call Details</SheetTitle>
          <SheetDescription>
            Complete information about the call
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)] mt-6">
          <div className="space-y-6">
            {/* Patient Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Patient Information
              </h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{call.patientName}</p>
                    <p className="text-sm text-muted-foreground">{call.patientStatus}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{call.phoneNumber}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Call Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Call Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Priority</span>
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Department</span>
                  </div>
                  <span className="text-sm font-medium">{call.department}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Wait Time</span>
                  </div>
                  <span className="text-sm font-medium">
                    {Math.floor(call.waitTime / 60)}m {call.waitTime % 60}s
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Created</span>
                  </div>
                  <span className="text-sm font-medium">
                    {formattedDate} at {formattedTime}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Call Reason */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Call Reason
              </h3>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <p className="text-sm">{call.reason}</p>
                </div>
              </div>
            </div>

            {/* Assignment Status */}
            {assignedAgent && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Assignment
                  </h3>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {assignedAgent.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{assignedAgent.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Status: {assignedAgent.status}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Escalation Note */}
            {call.escalationNote && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-destructive uppercase tracking-wider">
                    Escalation Note
                  </h3>
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <p className="text-sm">{call.escalationNote}</p>
                  </div>
                </div>
              </>
            )}

            {/* Status */}
            <Separator />
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Current Status
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {call.status.replace('-', ' ')}
                </Badge>
                {call.status === 'waiting' && (
                  <span className="text-sm text-muted-foreground">
                    • Waiting for assignment
                  </span>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <SheetFooter className="mt-6 gap-2">
          {call.status === 'waiting' && (
            <Button onClick={onAssign} className="flex-1">
              Assign Call
            </Button>
          )}
          {(call.status === 'assigned' || call.status === 'in-progress') && (
            <>
              <Button onClick={onTransfer} variant="outline" className="flex-1">
                Transfer
              </Button>
              <Button onClick={onEscalate} variant="destructive" className="flex-1">
                Escalate
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}