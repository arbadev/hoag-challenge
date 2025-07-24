import { useState } from "react";
import { format } from "date-fns";
import { Check, X, Clock, User, Calendar, AlertCircle } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Textarea } from "~/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { toast } from "sonner";
import type { ApprovalRequest, Shift } from "~/types/scheduling";

interface ApprovalQueueProps {
  requests: ApprovalRequest[];
  existingShifts: Shift[];
  onApprove: (requestId: string, notes?: string) => void;
  onReject: (requestId: string, notes?: string) => void;
}

interface ApprovalAction {
  requestId: string;
  action: "approve" | "reject";
}

export function ApprovalQueue({
  requests,
  existingShifts,
  onApprove,
  onReject,
}: ApprovalQueueProps) {
  const [selectedRequest, setSelectedRequest] = useState<ApprovalAction | null>(null);
  const [notes, setNotes] = useState("");
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);

  const handleAction = () => {
    if (!selectedRequest) return;

    if (selectedRequest.action === "approve") {
      onApprove(selectedRequest.requestId, notes);
      toast.success("Availability approved successfully");
    } else {
      onReject(selectedRequest.requestId, notes);
      toast.info("Availability request rejected");
    }

    setSelectedRequest(null);
    setNotes("");
  };

  const handleBulkApprove = () => {
    bulkSelected.forEach(requestId => {
      onApprove(requestId);
    });
    toast.success(`${bulkSelected.length} requests approved`);
    setBulkSelected([]);
  };

  const checkForConflicts = (request: ApprovalRequest): boolean => {
    // Simple conflict detection - check if provider has existing shift on same day/time
    return existingShifts.some(shift => 
      shift.providerId === request.availabilitySlot.providerId &&
      shift.date === request.availabilitySlot.date &&
      shift.status === "scheduled"
    );
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDayName = (dayNum: number) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[dayNum];
  };

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900">All caught up!</p>
            <p className="text-gray-500 mt-2">No pending approval requests at the moment.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {bulkSelected.length > 0 && (
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium">
              {bulkSelected.length} requests selected
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setBulkSelected([])}
              >
                Clear Selection
              </Button>
              <Button
                size="sm"
                onClick={handleBulkApprove}
                className="bg-green-600 hover:bg-green-700"
              >
                Approve Selected
              </Button>
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {requests.map((request) => {
            const hasConflict = checkForConflicts(request);
            const isSelected = bulkSelected.includes(request.id);
            
            return (
              <Card
                key={request.id}
                className={cn(
                  "transition-colors",
                  isSelected && "ring-2 ring-blue-500"
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBulkSelected([...bulkSelected, request.id]);
                          } else {
                            setBulkSelected(bulkSelected.filter(id => id !== request.id));
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${request.provider.name}`} />
                        <AvatarFallback>
                          {request.provider.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{request.provider.name}</h4>
                        <p className="text-sm text-gray-500">{request.provider.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasConflict && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Conflict
                        </Badge>
                      )}
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(request.requestedAt), "MMM d, h:mm a")}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">
                          {format(new Date(request.availabilitySlot.date), "EEEE, MMMM d, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>
                          {formatTime(request.availabilitySlot.startTime)} - {formatTime(request.availabilitySlot.endTime)}
                        </span>
                      </div>
                    </div>
                    
                    {request.availabilitySlot.isRecurring && (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          Recurring
                        </Badge>
                        <span className="text-sm text-gray-600">
                          Every {request.availabilitySlot.recurringDays?.map(getDayName).join(", ")}
                        </span>
                      </div>
                    )}
                    
                    {request.availabilitySlot.notes && (
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Notes:</span> {request.availabilitySlot.notes}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRequest({ requestId: request.id, action: "reject" })}
                        className="gap-1"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setSelectedRequest({ requestId: request.id, action: "approve" })}
                        className="gap-1 bg-green-600 hover:bg-green-700"
                        disabled={hasConflict}
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedRequest?.action === "approve" ? "Approve" : "Reject"} Availability Request
            </DialogTitle>
            <DialogDescription>
              Add any notes or comments for this decision.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Optional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              className={cn(
                selectedRequest?.action === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              )}
            >
              Confirm {selectedRequest?.action === "approve" ? "Approval" : "Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}