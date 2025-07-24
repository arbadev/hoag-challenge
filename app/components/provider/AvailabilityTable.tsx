import { useState } from "react";
import { format } from "date-fns";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

export interface AvailabilitySlot {
  id: string;
  providerId: string;
  date: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  recurringDays?: number[];
  status: "pending" | "approved" | "rejected";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface AvailabilityTableProps {
  slots: AvailabilitySlot[];
  onEdit: (slot: AvailabilitySlot) => void;
  onDelete: (id: string) => void;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
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

export function AvailabilityTable({ slots, onEdit, onDelete }: AvailabilityTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  if (slots.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="p-8 text-center">
          <p className="text-gray-500">No availability slots submitted yet.</p>
          <p className="text-sm text-gray-400 mt-2">
            Add your available times to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slots.map((slot) => (
              <TableRow key={slot.id}>
                <TableCell className="font-medium">
                  {format(new Date(slot.date), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                </TableCell>
                <TableCell>
                  {slot.isRecurring ? (
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">
                        Recurring
                      </Badge>
                      <span className="text-xs text-gray-500">
                        ({slot.recurringDays?.map(getDayName).join(", ")})
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-500">One-time</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={cn("capitalize", statusColors[slot.status])}>
                    {slot.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600 truncate max-w-[200px] block">
                    {slot.notes || "-"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onEdit(slot)}
                        disabled={slot.status !== "pending"}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteId(slot.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Availability Slot</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this availability slot? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}