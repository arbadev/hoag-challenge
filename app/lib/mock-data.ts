export interface Call {
  id: string
  patientName: string
  department: string
  patientStatus: string
  priority: 'high' | 'medium' | 'low'
  waitTime: number
  status: 'waiting' | 'assigned' | 'in-progress' | 'completed' | 'transferred' | 'escalated'
  assignedTo: string | null
  phoneNumber: string
  reason: string
  createdAt: string
  escalationNote?: string
}

export interface Agent {
  id: string
  name: string
  status: 'available' | 'busy' | 'offline'
  currentCalls: number
  totalHandled: number
  avgHandleTime: number
}

const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Mary', 'William', 'Patricia']
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']
const departments = ['Emergency', 'Cardiology', 'Pediatrics', 'Orthopedics', 'Neurology', 'General Medicine', 'Surgery', 'Radiology']
const patientStatuses = ['New Patient', 'Follow-up', 'Emergency', 'Routine Check', 'Post-Surgery', 'Lab Results']
const reasons = [
  'Chest pain - needs immediate attention',
  'Follow-up appointment scheduling',
  'Lab results inquiry',
  'Prescription refill request',
  'General health concern',
  'Appointment rescheduling',
  'Insurance verification',
  'Referral needed',
  'Post-surgery check-in',
  'Vaccination inquiry'
]

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function generatePhoneNumber(): string {
  const areaCode = Math.floor(Math.random() * 900) + 100
  const prefix = Math.floor(Math.random() * 900) + 100
  const lineNumber = Math.floor(Math.random() * 9000) + 1000
  return `(${areaCode}) ${prefix}-${lineNumber}`
}


function formatWaitTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function generateMockCalls(count: number = 25): Call[] {
  const calls: Call[] = []
  const now = new Date()
  
  for (let i = 0; i < count; i++) {
    const createdAt = new Date(now.getTime() - Math.random() * 3600000) // Within last hour
    const waitTime = Math.floor((now.getTime() - createdAt.getTime()) / 1000)
    
    const call: Call = {
      id: `call-${i + 1}`,
      patientName: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
      department: randomElement(departments),
      patientStatus: randomElement(patientStatuses),
      priority: randomElement(['high', 'medium', 'low'] as const),
      waitTime,
      status: randomElement(['waiting', 'assigned', 'in-progress'] as const),
      assignedTo: Math.random() > 0.5 ? `agent-${Math.floor(Math.random() * 8) + 1}` : null,
      phoneNumber: generatePhoneNumber(),
      reason: randomElement(reasons),
      createdAt: createdAt.toISOString(),
    }
    
    // Add escalation note for escalated calls
    if (call.status === 'escalated') {
      call.escalationNote = 'Patient requires immediate specialist attention'
    }
    
    // High priority calls are more likely to be assigned
    if (call.priority === 'high' && call.status === 'waiting' && Math.random() > 0.3) {
      call.status = 'assigned'
      call.assignedTo = `agent-${Math.floor(Math.random() * 8) + 1}`
    }
    
    calls.push(call)
  }
  
  return calls.sort((a, b) => {
    // Sort by priority first, then by wait time
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }
    return b.waitTime - a.waitTime
  })
}

export function generateMockAgents(count: number = 8): Agent[] {
  const agents: Agent[] = []
  const agentFirstNames = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Jamie', 'Riley']
  const agentLastNames = ['Anderson', 'Thompson', 'Jackson', 'White', 'Harris', 'Martin', 'Lee', 'Walker']
  
  for (let i = 0; i < count; i++) {
    const isAvailable = Math.random() > 0.3
    const isBusy = isAvailable && Math.random() > 0.4
    
    const agent: Agent = {
      id: `agent-${i + 1}`,
      name: `${agentFirstNames[i]} ${agentLastNames[i]}`,
      status: !isAvailable ? 'offline' : (isBusy ? 'busy' : 'available'),
      currentCalls: isBusy ? Math.floor(Math.random() * 3) + 1 : 0,
      totalHandled: Math.floor(Math.random() * 50) + 10,
      avgHandleTime: Math.floor(Math.random() * 600) + 180, // 3-13 minutes in seconds
    }
    
    agents.push(agent)
  }
  
  return agents
}

export function updateCallWaitTimes(calls: Call[]): Call[] {
  const now = new Date()
  
  return calls.map(call => {
    if (call.status === 'waiting' || call.status === 'assigned') {
      const createdAt = new Date(call.createdAt)
      const waitTime = Math.floor((now.getTime() - createdAt.getTime()) / 1000)
      return { ...call, waitTime }
    }
    return call
  })
}

export function simulateCallStatusChange(calls: Call[]): Call[] {
  // Randomly change status of some calls to simulate activity
  return calls.map(call => {
    const random = Math.random()
    
    // Small chance of status change
    if (random < 0.05) {
      if (call.status === 'waiting' && call.assignedTo) {
        return { ...call, status: 'in-progress' }
      } else if (call.status === 'in-progress') {
        return { ...call, status: 'completed' }
      }
    }
    
    return call
  })
}

export function getCallStats(calls: Call[]) {
  const total = calls.length
  const waiting = calls.filter(c => c.status === 'waiting').length
  const highPriority = calls.filter(c => c.priority === 'high').length
  const avgWaitTime = calls
    .filter(c => c.status === 'waiting')
    .reduce((sum, call) => sum + call.waitTime, 0) / (waiting || 1)
  
  return {
    total,
    waiting,
    highPriority,
    avgWaitTime: Math.floor(avgWaitTime),
  }
}

export function getAgentById(agents: Agent[], id: string): Agent | undefined {
  return agents.find(agent => agent.id === id)
}

export function getAvailableAgents(agents: Agent[]): Agent[] {
  return agents.filter(agent => agent.status === 'available')
}

export { formatWaitTime }