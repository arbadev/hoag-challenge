import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/components/ui/command"
import { Textarea } from "~/components/ui/textarea"
import { Label } from "~/components/ui/label"
import { Badge } from "~/components/ui/badge"
import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { useAgents } from "~/contexts/agents-context"
import { useCallQueue } from "~/contexts/call-queue-context"
import type { Call, Agent } from "~/lib/mock-data"
import { toast } from "sonner"

interface AssignCallModalProps {
  call: Call | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AssignCallModal({ call, open, onOpenChange }: AssignCallModalProps) {
  const { agents, availableAgents } = useAgents()
  const { assignCall, updateCallPriority } = useCallQueue()
  const [selectedAgentId, setSelectedAgentId] = useState<string>("")
  const [priority, setPriority] = useState<Call["priority"]>(call?.priority || "medium")
  const [notes, setNotes] = useState("")
  const [isAssigning, setIsAssigning] = useState(false)

  const handleAssign = async () => {
    if (!call || !selectedAgentId) return

    setIsAssigning(true)
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update priority if changed
      if (priority !== call.priority) {
        updateCallPriority(call.id, priority)
      }
      
      // Assign the call
      assignCall(call.id, selectedAgentId)
      
      toast.success(`Call assigned to ${agents.find(a => a.id === selectedAgentId)?.name}`)
      onOpenChange(false)
      
      // Reset form
      setSelectedAgentId("")
      setNotes("")
      setPriority(call.priority)
    } catch (error) {
      toast.error("Failed to assign call")
    } finally {
      setIsAssigning(false)
    }
  }

  if (!call) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Assign Call</DialogTitle>
          <DialogDescription>
            Assign call from {call.patientName} to an available agent.
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
            <p className="text-sm text-muted-foreground">{call.department}</p>
            <p className="text-sm text-muted-foreground">{call.reason}</p>
          </div>

          {/* Agent Selection */}
          <div className="space-y-2">
            <Label>Select Agent</Label>
            <Command className="rounded-lg border">
              <CommandInput placeholder="Search agents..." />
              <CommandList>
                <CommandEmpty>No agents found.</CommandEmpty>
                <CommandGroup heading="Available Agents">
                  {availableAgents.map((agent: Agent) => (
                    <CommandItem
                      key={agent.id}
                      value={agent.id}
                      onSelect={() => setSelectedAgentId(agent.id)}
                      className="flex items-center gap-3"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{agent.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Handling {agent.currentCalls} calls • Avg: {Math.floor(agent.avgHandleTime / 60)}m
                        </div>
                      </div>
                      {selectedAgentId === agent.id && (
                        <Badge variant="default">Selected</Badge>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>

          {/* Priority Adjustment */}
          <div className="space-y-2">
            <Label>Priority</Label>
            <RadioGroup value={priority} onValueChange={(value) => setPriority(value as Call["priority"])}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="font-normal cursor-pointer">High Priority</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="font-normal cursor-pointer">Medium Priority</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="font-normal cursor-pointer">Low Priority</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Assignment Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Assignment Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any relevant notes for the agent..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAssign} 
            disabled={!selectedAgentId || isAssigning}
          >
            {isAssigning ? "Assigning..." : "Assign Call"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}