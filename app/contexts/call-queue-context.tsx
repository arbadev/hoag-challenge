import { createContext, useContext, useState, useCallback, useEffect } from "react"
import type { ReactNode } from "react"
import { 
  generateMockCalls, 
  updateCallWaitTimes, 
  simulateCallStatusChange,
  getCallStats,
  type Call 
} from "~/lib/mock-data"

interface CallQueueContextType {
  calls: Call[]
  stats: {
    total: number
    waiting: number
    highPriority: number
    avgWaitTime: number
  }
  filters: {
    priority: 'all' | 'high' | 'medium' | 'low'
    department: string | null
    status: string | null
    searchTerm: string
  }
  updateFilters: (filters: Partial<CallQueueContextType['filters']>) => void
  updateCallStatus: (callId: string, status: Call['status']) => void
  assignCall: (callId: string, agentId: string) => void
  updateCallPriority: (callId: string, priority: Call['priority']) => void
  addEscalationNote: (callId: string, note: string) => void
  refreshCalls: () => void
}

const CallQueueContext = createContext<CallQueueContextType | undefined>(undefined)

export function CallQueueProvider({ children }: { children: ReactNode }) {
  const [calls, setCalls] = useState<Call[]>(() => generateMockCalls(25))
  const [filters, setFilters] = useState<CallQueueContextType['filters']>({
    priority: 'all',
    department: null,
    status: null,
    searchTerm: '',
  })

  // Update wait times every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCalls(prevCalls => {
        let updatedCalls = updateCallWaitTimes(prevCalls)
        // Occasionally simulate status changes
        if (Math.random() < 0.1) {
          updatedCalls = simulateCallStatusChange(updatedCalls)
        }
        return updatedCalls
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const updateFilters = useCallback((newFilters: Partial<CallQueueContextType['filters']>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  const updateCallStatus = useCallback((callId: string, status: Call['status']) => {
    setCalls(prev => prev.map(call => 
      call.id === callId ? { ...call, status } : call
    ))
  }, [])

  const assignCall = useCallback((callId: string, agentId: string) => {
    setCalls(prev => prev.map(call => 
      call.id === callId 
        ? { ...call, assignedTo: agentId, status: 'assigned' as const } 
        : call
    ))
  }, [])

  const updateCallPriority = useCallback((callId: string, priority: Call['priority']) => {
    setCalls(prev => {
      const updated = prev.map(call => 
        call.id === callId ? { ...call, priority } : call
      )
      // Re-sort by priority
      return updated.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        }
        return b.waitTime - a.waitTime
      })
    })
  }, [])

  const addEscalationNote = useCallback((callId: string, note: string) => {
    setCalls(prev => prev.map(call => 
      call.id === callId 
        ? { ...call, escalationNote: note, status: 'escalated' as const, priority: 'high' as const } 
        : call
    ))
  }, [])

  const refreshCalls = useCallback(() => {
    setCalls(generateMockCalls(25))
  }, [])

  // Filter calls based on current filters
  const filteredCalls = calls.filter(call => {
    if (filters.priority !== 'all' && call.priority !== filters.priority) {
      return false
    }
    if (filters.department && call.department !== filters.department) {
      return false
    }
    if (filters.status && call.status !== filters.status) {
      return false
    }
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      return (
        call.patientName.toLowerCase().includes(searchLower) ||
        call.phoneNumber.includes(filters.searchTerm) ||
        call.reason.toLowerCase().includes(searchLower) ||
        call.department.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  const stats = getCallStats(filteredCalls)

  const value = {
    calls: filteredCalls,
    stats,
    filters,
    updateFilters,
    updateCallStatus,
    assignCall,
    updateCallPriority,
    addEscalationNote,
    refreshCalls,
  }

  return (
    <CallQueueContext.Provider value={value}>
      {children}
    </CallQueueContext.Provider>
  )
}

export function useCallQueue() {
  const context = useContext(CallQueueContext)
  if (context === undefined) {
    throw new Error("useCallQueue must be used within a CallQueueProvider")
  }
  return context
}