import { useState } from "react"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "~/components/ui/alert-dialog"
import { Textarea } from "~/components/ui/textarea"
import { Label } from "~/components/ui/label"
import { Badge } from "~/components/ui/badge"
import { useCallQueue } from "~/contexts/call-queue-context"
import type { Call } from "~/lib/mock-data"
import { toast } from "sonner"
import { AlertTriangle } from "lucide-react"

interface EscalateCallModalProps {
  call: Call | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EscalateCallModal({ call, open, onOpenChange }: EscalateCallModalProps) {
  const { addEscalationNote, updateCallPriority } = useCallQueue()
  const [escalationReason, setEscalationReason] = useState("")
  const [isEscalating, setIsEscalating] = useState(false)

  const handleEscalate = async () => {
    if (!call || !escalationReason.trim()) return

    setIsEscalating(true)
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Add escalation note and update priority
      addEscalationNote(call.id, escalationReason)
      updateCallPriority(call.id, 'high')
      
      toast.success("Call escalated successfully", {
        description: "A supervisor has been notified and will handle this call immediately."
      })
      onOpenChange(false)
      
      // Reset form
      setEscalationReason("")
    } catch (error) {
      toast.error("Failed to escalate call")
    } finally {
      setIsEscalating(false)
    }
  }

  if (!call) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[525px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertDialogTitle>Escalate Call</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            This action will escalate the call to a supervisor immediately. The call will be marked as high priority.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Call Info */}
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{call.patientName}</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{call.priority}</Badge>
                <span className="text-sm">→</span>
                <Badge variant="destructive">HIGH</Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{call.department}</p>
            <p className="text-sm text-muted-foreground">{call.reason}</p>
            <p className="text-sm text-muted-foreground">
              Wait time: {Math.floor(call.waitTime / 60)}m {call.waitTime % 60}s
            </p>
          </div>

          {/* Escalation Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Escalation Reason <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Please provide a detailed reason for escalation..."
              value={escalationReason}
              onChange={(e) => setEscalationReason(e.target.value)}
              rows={4}
              className="resize-none"
              required
            />
            <p className="text-xs text-muted-foreground">
              This information will be sent to the supervisor handling the escalation.
            </p>
          </div>

          {/* Warning Message */}
          <div className="rounded-lg border border-warning bg-warning/10 p-3">
            <p className="text-sm">
              <strong>Note:</strong> Escalated calls are handled by senior staff and supervisors. 
              Use this option only for urgent situations that cannot be resolved through normal channels.
            </p>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleEscalate}
            disabled={!escalationReason.trim() || isEscalating}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isEscalating ? "Escalating..." : "Escalate Call"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}