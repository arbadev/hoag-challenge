import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks } from "date-fns";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import type { Shift } from "~/types/scheduling";
export type { Shift };

interface ShiftCalendarProps {
  shifts: Shift[];
  onShiftClick?: (shift: Shift) => void;
}

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
};

export function ShiftCalendar({ shifts, onShiftClick }: ShiftCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const getShiftsForDay = (date: Date) => {
    return shifts.filter(shift => 
      isSameDay(new Date(shift.date), date) && shift.status === "scheduled"
    );
  };

  const goToPreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const goToNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousWeek}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextWeek}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="ml-2"
          >
            Today
          </Button>
        </div>
        <h3 className="text-lg font-semibold">
          {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
        </h3>
      </div>

      <div className="rounded-lg border">
        <div className="grid grid-cols-7 border-b">
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              className={cn(
                "p-3 text-center border-r last:border-r-0",
                isSameDay(day, new Date()) && "bg-green-50"
              )}
            >
              <div className="font-medium text-sm">
                {format(day, "EEE")}
              </div>
              <div className={cn(
                "text-lg",
                isSameDay(day, new Date()) && "font-bold text-green-600"
              )}>
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7">
          {weekDays.map((day) => {
            const dayShifts = getShiftsForDay(day);
            
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "min-h-[120px] p-2 border-r last:border-r-0 border-b",
                  isSameDay(day, new Date()) && "bg-green-50/50"
                )}
              >
                {dayShifts.length === 0 ? (
                  <div className="text-xs text-gray-400 text-center mt-4">
                    No shifts
                  </div>
                ) : (
                  <div className="space-y-1">
                    {dayShifts.map((shift) => (
                      <Popover key={shift.id}>
                        <PopoverTrigger asChild>
                          <button
                            onClick={() => onShiftClick?.(shift)}
                            className="w-full text-left p-2 bg-green-100 hover:bg-green-200 rounded text-xs transition-colors"
                          >
                            <div className="font-medium text-green-800">
                              {formatTime(shift.startTime)}
                            </div>
                            <div className="text-green-600">
                              to {formatTime(shift.endTime)}
                            </div>
                            {shift.department && (
                              <div className="text-green-700 truncate mt-1">
                                {shift.department}
                              </div>
                            )}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4 text-gray-500" />
                              <h4 className="font-semibold">Shift Details</h4>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-medium">Date:</span>{" "}
                                {format(new Date(shift.date), "EEEE, MMMM d, yyyy")}
                              </div>
                              <div>
                                <span className="font-medium">Time:</span>{" "}
                                {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                              </div>
                              {shift.department && (
                                <div>
                                  <span className="font-medium">Department:</span>{" "}
                                  {shift.department}
                                </div>
                              )}
                              {shift.location && (
                                <div>
                                  <span className="font-medium">Location:</span>{" "}
                                  {shift.location}
                                </div>
                              )}
                              {shift.notes && (
                                <div>
                                  <span className="font-medium">Notes:</span>{" "}
                                  <p className="text-gray-600 mt-1">{shift.notes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 rounded" />
            <span>Scheduled Shift</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-50 rounded" />
            <span>Today</span>
          </div>
        </div>
        <div>
          Total shifts this week: <span className="font-medium">{shifts.filter(s => s.status === "scheduled").length}</span>
        </div>
      </div>
    </div>
  );
}