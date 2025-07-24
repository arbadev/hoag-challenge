import { localStorageService } from './local-storage'
import { 
  generateMockAgents, 
  generateMockCalls,
  type Agent, 
  type Call 
} from './mock-data'

// Ensure specific agents exist for demo users
const DEMO_AGENTS: Agent[] = [
  {
    id: 'agent-1',
    name: 'Alex Anderson',
    status: 'available',
    currentCalls: 0,
    totalHandled: 25,
    avgHandleTime: 420, // 7 minutes
  },
  {
    id: 'agent-2',
    name: 'Sam Thompson',
    status: 'available',
    currentCalls: 1,
    totalHandled: 18,
    avgHandleTime: 360, // 6 minutes
  }
]

export function generatePersistentMockAgents(count: number = 8): Agent[] {
  // Generate random agents
  const randomAgents = generateMockAgents(count - DEMO_AGENTS.length)
  
  // Ensure demo agents are included and update their IDs to not conflict
  const updatedRandomAgents = randomAgents.map((agent, index) => ({
    ...agent,
    id: `agent-${index + DEMO_AGENTS.length + 1}`
  }))
  
  // Combine demo agents with random ones
  return [...DEMO_AGENTS, ...updatedRandomAgents]
}

export function getOrGenerateAgents(): Agent[] {
  // Check localStorage first
  const storedAgents = localStorageService.getAgents()
  
  if (storedAgents && storedAgents.length > 0) {
    // Ensure demo agents are still included (in case of data corruption)
    const hasAgent1 = storedAgents.some(a => a.id === 'agent-1')
    if (!hasAgent1) {
      const updatedAgents = [...DEMO_AGENTS, ...storedAgents.filter(a => !DEMO_AGENTS.find(d => d.id === a.id))]
      localStorageService.saveAgents(updatedAgents)
      return updatedAgents
    }
    return storedAgents
  }
  
  // Generate new agents if none exist
  const newAgents = generatePersistentMockAgents(8)
  localStorageService.saveAgents(newAgents)
  return newAgents
}

export function getOrGenerateCalls(): Call[] {
  // Check localStorage first
  const storedCalls = localStorageService.getCalls()
  
  if (storedCalls && storedCalls.length > 0) {
    return storedCalls
  }
  
  // Generate new calls if none exist
  const newCalls = generateMockCalls(25)
  localStorageService.saveCalls(newCalls)
  return newCalls
}

export function resetMockData(): void {
  localStorageService.clearMockData()
  
  // Generate fresh data
  const newAgents = generatePersistentMockAgents(8)
  const newCalls = generateMockCalls(25)
  
  localStorageService.saveAgents(newAgents)
  localStorageService.saveCalls(newCalls)
  
  // Reload the page to reflect changes
  if (typeof window !== 'undefined') {
    window.location.reload()
  }
}

// Helper to get agent by username (for login mapping)
export function getAgentByUsername(username: string): Agent | null {
  const agents = getOrGenerateAgents()
  
  // Map specific usernames to agent IDs
  if (username === 'agent') {
    return agents.find(a => a.id === 'agent-1') || null
  }
  
  // For other cases, try to find by name
  return agents.find(a => a.name.toLowerCase() === username.toLowerCase()) || null
}