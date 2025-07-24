import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, FileText, Filter } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ScrollArea } from "~/components/ui/scroll-area";
import type { Shift } from "./ShiftCalendar";

interface ShiftListProps {
  shifts: Shift[];
  onShiftClick?: (shift: Shift) => void;
}

const statusColors = {
  scheduled: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
};

const calculateDuration = (startTime: string, endTime: string) => {
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);
  
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;
  
  const durationMinutes = endTotalMinutes - startTotalMinutes;
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  if (minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}m`;
};

export function ShiftList({ shifts, onShiftClick }: ShiftListProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");

  const filteredShifts = shifts.filter(shift => {
    if (filterStatus === "all") return true;
    return shift.status === filterStatus;
  });

  const sortedShifts = [...filteredShifts].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "department":
        return (a.department || "").localeCompare(b.department || "");
      case "duration":
        const aDuration = calculateDuration(a.startTime, a.endTime);
        const bDuration = calculateDuration(b.startTime, b.endTime);
        return aDuration.localeCompare(bDuration);
      default:
        return 0;
    }
  });

  const totalHours = sortedShifts
    .filter(s => s.status === "scheduled")
    .reduce((total, shift) => {
      const duration = calculateDuration(shift.startTime, shift.endTime);
      const hours = parseFloat(duration.replace("h", "").replace("m", ""));
      return total + hours;
    }, 0);

  if (shifts.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No shifts scheduled yet.</p>
          <p className="text-sm text-gray-400 mt-2">
            Your confirmed shifts will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shifts</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="department">Department</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          Total scheduled hours: <span className="font-semibold">{totalHours.toFixed(1)}h</span>
        </div>
      </div>

      <div className="rounded-md border">
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedShifts.map((shift) => (
                <TableRow
                  key={shift.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => onShiftClick?.(shift)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {format(new Date(shift.date), "MMM d, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {calculateDuration(shift.startTime, shift.endTime)}
                  </TableCell>
                  <TableCell>
                    {shift.department || <span className="text-gray-400">-</span>}
                  </TableCell>
                  <TableCell>
                    {shift.location ? (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">{shift.location}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("capitalize", statusColors[shift.status])}>
                      {shift.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {shift.notes ? (
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600 truncate max-w-[150px]">
                          {shift.notes}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="text-sm text-gray-500">
          Showing {sortedShifts.length} of {shifts.length} shifts
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Export to CSV
          </Button>
          <Button variant="outline" size="sm">
            Print Schedule
          </Button>
        </div>
      </div>
    </div>
  );
}