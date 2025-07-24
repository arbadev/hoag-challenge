import { createContext, useContext, useState, useCallback, useEffect } from "react"
import type { ReactNode } from "react"
import { 
  getAgentById,
  getAvailableAgents,
  type Agent 
} from "~/lib/mock-data"
import { getOrGenerateAgents } from "~/lib/mock-data-persistent"
import { localStorageService } from "~/lib/local-storage"

interface AgentsContextType {
  agents: Agent[]
  availableAgents: Agent[]
  getAgent: (id: string) => Agent | undefined
  updateAgentStatus: (agentId: string, status: Agent['status']) => void
  incrementAgentCalls: (agentId: string) => void
  decrementAgentCalls: (agentId: string) => void
  updateAgentMetrics: (agentId: string, handleTime: number) => void
  refreshAgents: () => void
}

const AgentsContext = createContext<AgentsContextType | undefined>(undefined)

export function AgentsProvider({ children }: { children: ReactNode }) {
  // Start with empty array to avoid hydration mismatch
  const [agents, setAgents] = useState<Agent[]>([])

  // Load persisted data or generate new data only on client after mount
  useEffect(() => {
    const persistedAgents = getOrGenerateAgents()
    setAgents(persistedAgents)
  }, [])

  // Save agents to localStorage whenever they change
  useEffect(() => {
    if (agents.length > 0) {
      localStorageService.saveAgents(agents)
    }
  }, [agents])

  // Simulate agent status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prevAgents => {
        return prevAgents.map(agent => {
          // Small chance of status change
          if (Math.random() < 0.02) {
            if (agent.status === 'available' && agent.currentCalls === 0) {
              // Might go offline or get a call
              return Math.random() < 0.5 
                ? { ...agent, status: 'offline' as const }
                : { ...agent, status: 'busy' as const, currentCalls: 1 }
            } else if (agent.status === 'busy' && agent.currentCalls === 0) {
              // Should become available
              return { ...agent, status: 'available' as const }
            } else if (agent.status === 'offline') {
              // Might come back online
              return Math.random() < 0.3 
                ? { ...agent, status: 'available' as const }
                : agent
            }
          }
          return agent
        })
      })
    }, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const getAgent = useCallback((id: string) => {
    return getAgentById(agents, id)
  }, [agents])

  const updateAgentStatus = useCallback((agentId: string, status: Agent['status']) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId ? { ...agent, status } : agent
    ))
  }, [])

  const incrementAgentCalls = useCallback((agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { 
            ...agent, 
            currentCalls: agent.currentCalls + 1,
            status: 'busy' as const 
          } 
        : agent
    ))
  }, [])

  const decrementAgentCalls = useCallback((agentId: string) => {
    setAgents(prev => prev.map(agent => {
      if (agent.id === agentId) {
        const newCallCount = Math.max(0, agent.currentCalls - 1)
        return { 
          ...agent, 
          currentCalls: newCallCount,
          status: newCallCount === 0 ? 'available' as const : 'busy' as const,
          totalHandled: agent.totalHandled + 1
        }
      }
      return agent
    }))
  }, [])

  const updateAgentMetrics = useCallback((agentId: string, handleTime: number) => {
    setAgents(prev => prev.map(agent => {
      if (agent.id === agentId) {
        // Update average handle time
        const newTotal = agent.totalHandled + 1
        const newAvg = (agent.avgHandleTime * agent.totalHandled + handleTime) / newTotal
        return { 
          ...agent, 
          avgHandleTime: Math.floor(newAvg)
        }
      }
      return agent
    }))
  }, [])

  const refreshAgents = useCallback(() => {
    // Reload from localStorage to get latest data
    const persistedAgents = getOrGenerateAgents()
    setAgents(persistedAgents)
  }, [])

  const availableAgents = getAvailableAgents(agents)

  const value = {
    agents,
    availableAgents,
    getAgent,
    updateAgentStatus,
    incrementAgentCalls,
    decrementAgentCalls,
    updateAgentMetrics,
    refreshAgents,
  }

  return (
    <AgentsContext.Provider value={value}>
      {children}
    </AgentsContext.Provider>
  )
}

export function useAgents() {
  const context = useContext(AgentsContext)
  if (context === undefined) {
    throw new Error("useAgents must be used within an AgentsProvider")
  }
  return context
}