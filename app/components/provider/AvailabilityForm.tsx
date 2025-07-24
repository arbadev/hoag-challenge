import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";

interface AvailabilityFormData {
  date: Date | undefined;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  recurringDays?: number[];
  notes?: string;
}

interface AvailabilityFormProps {
  onSubmit: (data: AvailabilityFormData) => void;
  onCancel?: () => void;
}

// Generate time options in 30-minute intervals
const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  const time = `${hour.toString().padStart(2, "0")}:${minute}`;
  const label = `${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}:${minute} ${hour < 12 ? "AM" : "PM"}`;
  return { value: time, label };
});

const weekDays = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export function AvailabilityForm({ onSubmit, onCancel }: AvailabilityFormProps) {
  const [date, setDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!date) {
      newErrors.date = "Please select a date";
    }
    if (!startTime) {
      newErrors.startTime = "Please select a start time";
    }
    if (!endTime) {
      newErrors.endTime = "Please select an end time";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    if (date) {
      onSubmit({
        date,
        startTime,
        endTime,
        isRecurring,
        recurringDays: isRecurring ? selectedDays : undefined,
        notes: notes || undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              {date ? format(date, "PPP") : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) =>
                date < new Date(new Date().setHours(0, 0, 0, 0))
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.date && (
          <p className="text-sm text-red-500">{errors.date}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Select value={startTime} onValueChange={setStartTime}>
            <SelectTrigger id="startTime">
              <SelectValue placeholder="Select start time" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.startTime && (
            <p className="text-sm text-red-500">{errors.startTime}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Select value={endTime} onValueChange={setEndTime}>
            <SelectTrigger id="endTime">
              <SelectValue placeholder="Select end time" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.endTime && (
            <p className="text-sm text-red-500">{errors.endTime}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label htmlFor="recurring" className="text-base">
            Recurring Availability
          </Label>
          <p className="text-sm text-muted-foreground">
            Set this availability to repeat weekly
          </p>
        </div>
        <Switch
          id="recurring"
          checked={isRecurring}
          onCheckedChange={setIsRecurring}
        />
      </div>

      {isRecurring && (
        <div className="space-y-3">
          <Label>Select Days</Label>
          <div className="grid grid-cols-2 gap-3">
            {weekDays.map((day) => (
              <label
                key={day.value}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={day.value}
                  checked={selectedDays.includes(day.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedDays([...selectedDays, day.value]);
                    } else {
                      setSelectedDays(selectedDays.filter(d => d !== day.value));
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium">{day.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Add any additional notes..."
          className="resize-none"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          Submit Availability
        </Button>
      </div>
    </form>
  );
}