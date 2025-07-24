import { useState } from "react"
import { ProtectedRoute } from "~/components/protected-route"
import { MainLayout } from "~/components/layouts/main-layout"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "~/components/ui/table"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "~/components/ui/dropdown-menu"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { 
  AssignCallModal, 
  TransferCallModal, 
  EscalateCallModal, 
  CallDetailsModal 
} from "~/components/modals"
import { useCallQueue } from "~/contexts/call-queue-context"
import type { Call } from "~/lib/mock-data"
import { 
  MoreHorizontal, 
  UserPlus, 
  ArrowRightLeft, 
  AlertTriangle,
  Eye,
  Search
} from "lucide-react"

export default function QueuePage() {
  const { calls } = useCallQueue()
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  
  // Modal states
  const [selectedCall, setSelectedCall] = useState<Call | null>(null)
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [transferModalOpen, setTransferModalOpen] = useState(false)
  const [escalateModalOpen, setEscalateModalOpen] = useState(false)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)

  // Filter calls
  const filteredCalls = calls.filter(call => {
    const matchesSearch = 
      call.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.phoneNumber.includes(searchTerm) ||
      call.reason.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesPriority = priorityFilter === "all" || call.priority === priorityFilter
    const matchesDepartment = departmentFilter === "all" || call.department === departmentFilter
    
    return matchesSearch && matchesPriority && matchesDepartment
  })

  // Get unique departments for filter
  const departments = [...new Set(calls.map(call => call.department))]

  const handleViewDetails = (call: Call) => {
    setSelectedCall(call)
    setDetailsModalOpen(true)
  }

  const handleAssign = (call: Call) => {
    setSelectedCall(call)
    setAssignModalOpen(true)
  }

  const handleTransfer = (call: Call) => {
    setSelectedCall(call)
    setTransferModalOpen(true)
  }

  const handleEscalate = (call: Call) => {
    setSelectedCall(call)
    setEscalateModalOpen(true)
  }

  const formatWaitTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Call Queue</h1>
            <p className="text-muted-foreground">
              Manage incoming calls and assignments
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Call Queue Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Wait Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCalls.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No calls found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCalls.map((call) => (
                    <TableRow key={call.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p>{call.patientName}</p>
                          <p className="text-sm text-muted-foreground">{call.phoneNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell>{call.department}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            call.priority === "high" ? "destructive" : 
                            call.priority === "medium" ? "default" : 
                            "secondary"
                          }
                        >
                          {call.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">
                        {formatWaitTime(call.waitTime)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {call.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {call.reason}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(call)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {call.status === 'waiting' && (
                              <DropdownMenuItem onClick={() => handleAssign(call)}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Assign
                              </DropdownMenuItem>
                            )}
                            {(call.status === 'assigned' || call.status === 'in-progress') && (
                              <>
                                <DropdownMenuItem onClick={() => handleTransfer(call)}>
                                  <ArrowRightLeft className="mr-2 h-4 w-4" />
                                  Transfer
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleEscalate(call)}
                                  className="text-destructive"
                                >
                                  <AlertTriangle className="mr-2 h-4 w-4" />
                                  Escalate
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Modals */}
        <AssignCallModal 
          call={selectedCall} 
          open={assignModalOpen} 
          onOpenChange={setAssignModalOpen} 
        />
        <TransferCallModal 
          call={selectedCall} 
          open={transferModalOpen} 
          onOpenChange={setTransferModalOpen} 
        />
        <EscalateCallModal 
          call={selectedCall} 
          open={escalateModalOpen} 
          onOpenChange={setEscalateModalOpen} 
        />
        <CallDetailsModal 
          call={selectedCall} 
          open={detailsModalOpen} 
          onOpenChange={setDetailsModalOpen}
          onAssign={() => {
            setDetailsModalOpen(false)
            setAssignModalOpen(true)
          }}
          onTransfer={() => {
            setDetailsModalOpen(false)
            setTransferModalOpen(true)
          }}
          onEscalate={() => {
            setDetailsModalOpen(false)
            setEscalateModalOpen(true)
          }}
        />
      </MainLayout>
    </ProtectedRoute>
  )
}

export function meta() {
  return [
    { title: "Call Queue - Call Center Management" },
    { name: "description", content: "Manage call queue" },
  ]
}