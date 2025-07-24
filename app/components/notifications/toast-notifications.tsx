import { toast } from "sonner"
import { CheckCircle, XCircle, AlertCircle, Info, Phone, UserPlus, ArrowRightLeft, AlertTriangle } from "lucide-react"
import type { Call, Agent } from "~/lib/mock-data"

// Success notifications
export const toastSuccess = {
  callAssigned: (agentName: string) => {
    toast.success("Call Assigned", {
      description: `Successfully assigned to ${agentName}`,
      icon: <UserPlus className="h-4 w-4" />,
    })
  },
  
  callTransferred: (department: string) => {
    toast.success("Call Transferred", {
      description: `Call moved to ${department} department`,
      icon: <ArrowRightLeft className="h-4 w-4" />,
    })
  },
  
  callCompleted: () => {
    toast.success("Call Completed", {
      description: "Call has been marked as completed",
      icon: <CheckCircle className="h-4 w-4" />,
    })
  },
  
  callEscalated: () => {
    toast.success("Call Escalated", {
      description: "Supervisor has been notified immediately",
      icon: <AlertTriangle className="h-4 w-4" />,
      className: "border-orange-200 bg-orange-50",
    })
  },
  
  priorityUpdated: (priority: string) => {
    toast.success("Priority Updated", {
      description: `Call priority changed to ${priority}`,
      icon: <AlertCircle className="h-4 w-4" />,
    })
  },
}

// Error notifications
export const toastError = {
  assignmentFailed: () => {
    toast.error("Assignment Failed", {
      description: "Unable to assign call. Please try again.",
      icon: <XCircle className="h-4 w-4" />,
    })
  },
  
  transferFailed: () => {
    toast.error("Transfer Failed", {
      description: "Unable to transfer call. Please try again.",
      icon: <XCircle className="h-4 w-4" />,
    })
  },
  
  noAvailableAgents: () => {
    toast.error("No Available Agents", {
      description: "All agents are currently busy. Please wait.",
      icon: <UserPlus className="h-4 w-4" />,
    })
  },
  
  connectionError: () => {
    toast.error("Connection Error", {
      description: "Unable to connect to server. Retrying...",
      icon: <XCircle className="h-4 w-4" />,
      duration: 5000,
    })
  },
}

// Info notifications
export const toastInfo = {
  newCallInQueue: (patientName: string, priority: Call["priority"]) => {
    toast.info("New Call in Queue", {
      description: `${patientName} - ${priority} priority`,
      icon: <Phone className="h-4 w-4" />,
      className: priority === "high" ? "border-red-200" : undefined,
    })
  },
  
  agentStatusChanged: (agentName: string, status: Agent["status"]) => {
    toast.info("Agent Status Update", {
      description: `${agentName} is now ${status}`,
      icon: <Info className="h-4 w-4" />,
    })
  },
  
  queuePositionUpdated: (position: number) => {
    toast.info("Queue Updated", {
      description: `Call moved to position ${position}`,
      icon: <Info className="h-4 w-4" />,
    })
  },
}

// Loading notifications
export const toastLoading = {
  assigningCall: () => {
    return toast.loading("Assigning call...", {
      description: "Please wait while we find an available agent",
    })
  },
  
  transferringCall: () => {
    return toast.loading("Transferring call...", {
      description: "Moving call to the selected department",
    })
  },
  
  escalatingCall: () => {
    return toast.loading("Escalating call...", {
      description: "Notifying supervisor",
    })
  },
  
  loadingQueue: () => {
    return toast.loading("Loading queue...", {
      description: "Fetching latest call data",
    })
  },
}

// Custom notification with action
export const toastWithAction = {
  callAssignmentRequest: (call: Call, onAccept: () => void, onDecline: () => void) => {
    toast("New Call Assignment", {
      description: `${call.patientName} - ${call.department}`,
      action: {
        label: "Accept",
        onClick: onAccept,
      },
      cancel: {
        label: "Decline",
        onClick: onDecline,
      },
      duration: 10000,
      icon: <Phone className="h-4 w-4" />,
    })
  },
  
  highPriorityAlert: (call: Call, onView: () => void) => {
    toast.error("High Priority Call", {
      description: `${call.patientName} requires immediate attention`,
      action: {
        label: "View Details",
        onClick: onView,
      },
      duration: Infinity,
      icon: <AlertTriangle className="h-4 w-4" />,
    })
  },
}

// Dismiss a loading toast and show result
export const dismissLoadingToast = (toastId: string | number, success: boolean, message?: string) => {
  toast.dismiss(toastId)
  if (success) {
    toast.success(message || "Operation completed successfully")
  } else {
    toast.error(message || "Operation failed")
  }
}