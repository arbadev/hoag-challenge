import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "~/components/ui/context-menu"
import { Badge } from "~/components/ui/badge"
import type { Call } from "~/lib/mock-data"
import {
  UserPlus,
  ArrowRightLeft,
  AlertTriangle,
  Eye,
  Copy,
  Phone,
  CheckCircle,
  XCircle,
  Flag
} from "lucide-react"

interface CallContextMenuProps {
  call: Call
  onAssign?: () => void
  onTransfer?: () => void
  onEscalate?: () => void
  onViewDetails?: () => void
  onComplete?: () => void
  onDecline?: () => void
  onChangePriority?: (priority: Call["priority"]) => void
  userRole: "agent" | "admin"
  children: React.ReactNode
}

export function CallContextMenu({
  call,
  onAssign,
  onTransfer,
  onEscalate,
  onViewDetails,
  onComplete,
  onDecline,
  onChangePriority,
  userRole,
  children
}: CallContextMenuProps) {
  const handleCopyInfo = () => {
    const info = `Patient: ${call.patientName}
Phone: ${call.phoneNumber}
Department: ${call.department}
Priority: ${call.priority}
Reason: ${call.reason}`
    navigator.clipboard.writeText(info)
  }

  const isWaiting = call.status === 'waiting'
  const isAssigned = call.status === 'assigned'
  const isInProgress = call.status === 'in-progress'
  const canModify = isAssigned || isInProgress

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{call.patientName}</p>
          <p className="text-xs text-muted-foreground">{call.phoneNumber}</p>
        </div>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem onClick={onViewDetails}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
          <ContextMenuShortcut>⌘I</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem onClick={handleCopyInfo}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Call Info
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        {/* Actions based on status and role */}
        {isWaiting && userRole === "admin" && (
          <ContextMenuItem onClick={onAssign}>
            <UserPlus className="mr-2 h-4 w-4" />
            Assign to Agent
            <ContextMenuShortcut>⌘A</ContextMenuShortcut>
          </ContextMenuItem>
        )}

        {canModify && (
          <>
            <ContextMenuItem onClick={onTransfer}>
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Transfer Call
              <ContextMenuShortcut>⌘T</ContextMenuShortcut>
            </ContextMenuItem>

            <ContextMenuItem onClick={onEscalate} className="text-destructive">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Escalate to Supervisor
              <ContextMenuShortcut>⌘E</ContextMenuShortcut>
            </ContextMenuItem>
          </>
        )}

        {/* Priority submenu for admins */}
        {userRole === "admin" && (
          <>
            <ContextMenuSeparator />
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <Flag className="mr-2 h-4 w-4" />
                Change Priority
              </ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem 
                  onClick={() => onChangePriority?.("high")}
                  disabled={call.priority === "high"}
                >
                  <Badge variant="destructive" className="mr-2">High</Badge>
                  {call.priority === "high" && <CheckCircle className="ml-auto h-4 w-4" />}
                </ContextMenuItem>
                <ContextMenuItem 
                  onClick={() => onChangePriority?.("medium")}
                  disabled={call.priority === "medium"}
                >
                  <Badge variant="default" className="mr-2">Medium</Badge>
                  {call.priority === "medium" && <CheckCircle className="ml-auto h-4 w-4" />}
                </ContextMenuItem>
                <ContextMenuItem 
                  onClick={() => onChangePriority?.("low")}
                  disabled={call.priority === "low"}
                >
                  <Badge variant="secondary" className="mr-2">Low</Badge>
                  {call.priority === "low" && <CheckCircle className="ml-auto h-4 w-4" />}
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
          </>
        )}

        {/* Call actions */}
        {isInProgress && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={onComplete} className="text-green-600">
              <CheckCircle className="mr-2 h-4 w-4" />
              Complete Call
              <ContextMenuShortcut>⌘K</ContextMenuShortcut>
            </ContextMenuItem>
          </>
        )}

        {isWaiting && userRole === "agent" && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={onDecline} className="text-muted-foreground">
              <XCircle className="mr-2 h-4 w-4" />
              Decline Call
            </ContextMenuItem>
          </>
        )}

        <ContextMenuSeparator />
        
        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Status:</span>
            <Badge variant="outline" className="text-xs capitalize">
              {call.status.replace('-', ' ')}
            </Badge>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span>Wait time:</span>
            <span className="font-mono">
              {Math.floor(call.waitTime / 60)}:{(call.waitTime % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </ContextMenuContent>
    </ContextMenu>
  )
}