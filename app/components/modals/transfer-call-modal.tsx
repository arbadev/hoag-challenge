import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Textarea } from "~/components/ui/textarea"
import { Label } from "~/components/ui/label"
import { Badge } from "~/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { useCallQueue } from "~/contexts/call-queue-context"
import type { Call } from "~/lib/mock-data"
import { toast } from "sonner"

interface TransferCallModalProps {
  call: Call | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const departments = [
  "Emergency",
  "Cardiology",
  "Pediatrics",
  "Orthopedics",
  "Neurology",
  "General Medicine",
  "Surgery",
  "Radiology"
]

const transferReasons = [
  { value: "specialist", label: "Requires specialist consultation" },
  { value: "department", label: "Wrong department" },
  { value: "language", label: "Language barrier" },
  { value: "request", label: "Patient request" },
  { value: "escalation", label: "Escalation required" },
  { value: "other", label: "Other" }
]

export function TransferCallModal({ call, open, onOpenChange }: TransferCallModalProps) {
  const { updateCallStatus } = useCallQueue()
  const [targetDepartment, setTargetDepartment] = useState<string>("")
  const [reason, setReason] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [isTransferring, setIsTransferring] = useState(false)

  const handleTransfer = async () => {
    if (!call || !targetDepartment || !reason) return

    setIsTransferring(true)
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update call status to transferred
      updateCallStatus(call.id, 'transferred')
      
      toast.success(`Call transferred to ${targetDepartment}`, {
        description: `Reason: ${transferReasons.find(r => r.value === reason)?.label}`
      })
      onOpenChange(false)
      
      // Reset form
      setTargetDepartment("")
      setReason("")
      setNotes("")
    } catch (error) {
      toast.error("Failed to transfer call")
    } finally {
      setIsTransferring(false)
    }
  }

  if (!call) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Transfer Call</DialogTitle>
          <DialogDescription>
            Transfer call from {call.patientName} to another department.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Call Info */}
          <div className="rounded-lg border p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{call.patientName}</span>
              <Badge variant={call.priority === "high" ? "destructive" : call.priority === "medium" ? "default" : "secondary"}>
                {call.priority}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Current: {call.department}</p>
            <p className="text-sm text-muted-foreground">{call.reason}</p>
          </div>

          {/* Target Department */}
          <div className="space-y-2">
            <Label htmlFor="department">Transfer to Department</Label>
            <Select value={targetDepartment} onValueChange={setTargetDepartment}>
              <SelectTrigger id="department">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments
                  .filter(dept => dept !== call.department)
                  .map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Transfer Reason */}
          <div className="space-y-2">
            <Label>Transfer Reason</Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              {transferReasons.map((transferReason) => (
                <div key={transferReason.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={transferReason.value} id={transferReason.value} />
                  <Label htmlFor={transferReason.value} className="font-normal cursor-pointer">
                    {transferReason.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Transfer Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Transfer Notes</Label>
            <Textarea
              id="notes"
              placeholder="Provide details about the transfer..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              required
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleTransfer} 
            disabled={!targetDepartment || !reason || !notes || isTransferring}
          >
            {isTransferring ? "Transferring..." : "Transfer Call"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}