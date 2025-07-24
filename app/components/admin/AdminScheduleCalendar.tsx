import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, AlertCircle } from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks } from "date-fns";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "~/components/ui/context-menu";
import { ScrollArea } from "~/components/ui/scroll-area";
import type { Shift, Provider } from "~/types/scheduling";

interface AdminScheduleCalendarProps {
  shifts: Shift[];
  providers: Provider[];
  onShiftUpdate?: (shiftId: string, updates: Partial<Shift>) => void;
  onShiftCancel?: (shiftId: string) => void;
  onAddShift?: (date: Date, providerId?: string) => void;
}

// Provider colors for visual distinction
const providerColors = [
  "bg-blue-100 text-blue-800 hover:bg-blue-200",
  "bg-green-100 text-green-800 hover:bg-green-200",
  "bg-purple-100 text-purple-800 hover:bg-purple-200",
  "bg-orange-100 text-orange-800 hover:bg-orange-200",
  "bg-pink-100 text-pink-800 hover:bg-pink-200",
];

export function AdminScheduleCalendar({
  shifts,
  providers,
  onShiftUpdate,
  onShiftCancel,
  onAddShift,
}: AdminScheduleCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedProvider, setSelectedProvider] = useState<string | "all">("all");
  
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const getProviderColor = (providerId: string) => {
    const index = providers.findIndex(p => p.id === providerId);
    return providerColors[index % providerColors.length];
  };
  
  const getShiftsForDay = (date: Date) => {
    return shifts.filter(shift => {
      const matchesDate = isSameDay(new Date(shift.date), date) && shift.status === "scheduled";
      const matchesProvider = selectedProvider === "all" || shift.providerId === selectedProvider;
      return matchesDate && matchesProvider;
    });
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
          
          <div className="ml-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="all">All Providers</option>
              {providers
                .filter(p => p.status === "active")
                .map(provider => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
            </select>
          </div>
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
                isSameDay(day, new Date()) && "bg-blue-50"
              )}
            >
              <div className="font-medium text-sm">
                {format(day, "EEE")}
              </div>
              <div className={cn(
                "text-lg",
                isSameDay(day, new Date()) && "font-bold text-blue-600"
              )}>
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7">
          {weekDays.map((day) => {
            const dayShifts = getShiftsForDay(day);
            const hasGap = dayShifts.length < 2; // Simple gap detection
            
            return (
              <ContextMenu key={day.toISOString()}>
                <ContextMenuTrigger>
                  <div
                    className={cn(
                      "min-h-[150px] p-2 border-r last:border-r-0 border-b relative",
                      isSameDay(day, new Date()) && "bg-blue-50/50"
                    )}
                  >
                    {hasGap && (
                      <div className="absolute top-1 right-1">
                        <HoverCard>
                          <HoverCardTrigger>
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                          </HoverCardTrigger>
                          <HoverCardContent className="w-48">
                            <p className="text-sm">Coverage gap detected. Consider assigning more providers.</p>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                    )}
                    
                    <ScrollArea className="h-[130px]">
                      {dayShifts.length === 0 ? (
                        <div className="text-xs text-gray-400 text-center mt-4">
                          No shifts scheduled
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {dayShifts.map((shift) => {
                            const provider = providers.find(p => p.id === shift.providerId);
                            const formatTime = (time: string) => {
                              const [hours, minutes] = time.split(":");
                              const hour = parseInt(hours);
                              const ampm = hour >= 12 ? "PM" : "AM";
                              const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                              return `${displayHour}:${minutes} ${ampm}`;
                            };
                            
                            return (
                              <HoverCard key={shift.id}>
                                <HoverCardTrigger asChild>
                                  <div
                                    className={cn(
                                      "p-1.5 rounded text-xs cursor-pointer transition-colors",
                                      getProviderColor(shift.providerId)
                                    )}
                                  >
                                    <div className="font-medium truncate">
                                      {provider?.name.split(' ')[0]}
                                    </div>
                                    <div className="text-xs opacity-75">
                                      {formatTime(shift.startTime)}
                                    </div>
                                  </div>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-64">
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-semibold">{provider?.name}</h4>
                                      <Badge variant="outline" className="text-xs">
                                        {shift.department}
                                      </Badge>
                                    </div>
                                    <div className="text-sm space-y-1">
                                      <div>
                                        <span className="font-medium">Time:</span>{" "}
                                        {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                                      </div>
                                      {shift.location && (
                                        <div>
                                          <span className="font-medium">Location:</span>{" "}
                                          {shift.location}
                                        </div>
                                      )}
                                      {shift.notes && (
                                        <div>
                                          <span className="font-medium">Notes:</span>{" "}
                                          <p className="text-gray-600">{shift.notes}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                            );
                          })}
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => onAddShift?.(day)}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Add Shift
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem disabled>
                    View Day Details
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Total shifts: {shifts.filter(s => s.status === "scheduled").length}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <span>Coverage gaps: 3</span>
          </div>
        </div>
        <Button variant="outline" size="sm">
          Export Schedule
        </Button>
      </div>
    </div>
  );
}