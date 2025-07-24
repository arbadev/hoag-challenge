import { useState } from "react";
import { Search, Phone, Mail, MoreVertical, UserCheck, UserX, Clock, TrendingUp } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Progress } from "~/components/ui/progress";
import { Separator } from "~/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import type { Provider, Shift, AvailabilitySlot } from "~/types/scheduling";

interface ProviderDirectoryProps {
  providers: Provider[];
  shifts: Shift[];
  availability: AvailabilitySlot[];
  onProviderStatusChange?: (providerId: string, status: "active" | "inactive") => void;
}

export function ProviderDirectory({
  providers,
  shifts,
  availability,
  onProviderStatusChange,
}: ProviderDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string>("all");

  const departments = Array.from(new Set(providers.map(p => p.department).filter(Boolean)));

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === "all" || provider.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const getProviderStats = (providerId: string) => {
    const providerShifts = shifts.filter(s => s.providerId === providerId);
    const scheduledShifts = providerShifts.filter(s => s.status === "scheduled");
    const completedShifts = providerShifts.filter(s => s.status === "completed");
    const hoursThisWeek = scheduledShifts.reduce((total, shift) => {
      const start = parseInt(shift.startTime.split(":")[0]);
      const end = parseInt(shift.endTime.split(":")[0]);
      return total + (end - start);
    }, 0);

    return {
      totalShifts: providerShifts.length,
      scheduledShifts: scheduledShifts.length,
      completedShifts: completedShifts.length,
      hoursThisWeek,
    };
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search providers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">This Week</TableHead>
                <TableHead className="text-center">Reliability</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProviders.map((provider) => {
                const stats = getProviderStats(provider.id);
                
                return (
                  <TableRow key={provider.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${provider.name}`} />
                          <AvatarFallback>
                            {provider.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{provider.name}</p>
                          <p className="text-sm text-gray-500">
                            Since {new Date(provider.joinedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {provider.department || "Unassigned"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <a href={`mailto:${provider.email}`} className="hover:underline">
                            {provider.email}
                          </a>
                        </div>
                        {provider.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <span>{provider.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={cn(
                          "gap-1",
                          provider.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        )}
                      >
                        {provider.status === "active" ? (
                          <UserCheck className="h-3 w-3" />
                        ) : (
                          <UserX className="h-3 w-3" />
                        )}
                        {provider.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{stats.hoursThisWeek}h</p>
                        <p className="text-xs text-gray-500">{stats.scheduledShifts} shifts</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Progress value={provider.reliabilityScore} className="w-16" />
                        <span className="text-sm font-medium">{provider.reliabilityScore}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedProvider(provider)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>View Schedule</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onProviderStatusChange?.(
                              provider.id,
                              provider.status === "active" ? "inactive" : "active"
                            )}
                          >
                            {provider.status === "active" ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <Sheet open={!!selectedProvider} onOpenChange={() => setSelectedProvider(null)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selectedProvider && (
            <>
              <SheetHeader>
                <SheetTitle>Provider Details</SheetTitle>
                <SheetDescription>
                  Comprehensive information about {selectedProvider.name}
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-6 px-6 pb-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedProvider.name}`} />
                    <AvatarFallback>
                      {selectedProvider.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedProvider.name}</h3>
                    <p className="text-sm text-gray-500">{selectedProvider.department}</p>
                    <Badge
                      className={cn(
                        "mt-1",
                        selectedProvider.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      )}
                    >
                      {selectedProvider.status}
                    </Badge>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{selectedProvider.email}</span>
                      </div>
                      {selectedProvider.phone && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{selectedProvider.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Performance Metrics</h4>
                    <div className="space-y-3">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Total Hours Worked</span>
                          <span className="text-lg font-semibold text-gray-900">{selectedProvider.totalHoursWorked}h</span>
                        </div>
                        <div className="text-xs text-gray-500">Lifetime total</div>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Reliability Score</span>
                          <span className="text-lg font-semibold text-gray-900">{selectedProvider.reliabilityScore}%</span>
                        </div>
                        <Progress value={selectedProvider.reliabilityScore} className="h-2" />
                        <div className="text-xs text-gray-500 mt-2">Based on attendance and punctuality</div>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Member Since</span>
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(selectedProvider.joinedAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h4>
                    {(() => {
                      const stats = getProviderStats(selectedProvider.id);
                      const recentAvailability = availability
                        .filter(a => a.providerId === selectedProvider.id)
                        .slice(0, 3);
                      
                      return (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{stats.hoursThisWeek} hours this week</p>
                              <p className="text-xs text-gray-600">{stats.scheduledShifts} scheduled shifts</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{stats.completedShifts} completed</p>
                              <p className="text-xs text-gray-600">Total shifts to date</p>
                            </div>
                          </div>
                          
                          {recentAvailability.length > 0 && (
                            <div className="mt-4">
                              <p className="text-xs font-medium text-gray-700 mb-2">Recent Availability Requests</p>
                              <div className="space-y-2">
                                {recentAvailability.map(avail => (
                                  <div key={avail.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-600">
                                      {new Date(avail.date).toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric' 
                                      })}
                                    </span>
                                    <Badge 
                                      variant={avail.status === 'approved' ? 'default' : avail.status === 'pending' ? 'secondary' : 'destructive'} 
                                      className="text-xs"
                                    >
                                      {avail.status}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}