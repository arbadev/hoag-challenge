import type { Agent, Call } from './mock-data'

const STORAGE_KEYS = {
  AGENTS: 'hoag_challenge_agents',
  CALLS: 'hoag_challenge_calls',
  AUTH: 'hoag_challenge_auth',
  DATA_VERSION: 'hoag_challenge_data_version',
} as const

// Data version to handle schema changes
const CURRENT_DATA_VERSION = 1

interface StoredAuth {
  id: string
  name: string
  role: 'agent' | 'admin'
  permissions: string[]
}

class LocalStorageService {
  private isClient = typeof window !== 'undefined'

  private getItem<T>(key: string): T | null {
    if (!this.isClient) return null
    
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error)
      return null
    }
  }

  private setItem<T>(key: string, value: T): void {
    if (!this.isClient) return
    
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error)
    }
  }

  private removeItem(key: string): void {
    if (!this.isClient) return
    
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error)
    }
  }

  // Check if we need to clear old data
  checkDataVersion(): void {
    const storedVersion = this.getItem<number>(STORAGE_KEYS.DATA_VERSION)
    if (storedVersion !== CURRENT_DATA_VERSION) {
      this.clearAllData()
      this.setItem(STORAGE_KEYS.DATA_VERSION, CURRENT_DATA_VERSION)
    }
  }

  // Agents methods
  getAgents(): Agent[] | null {
    return this.getItem<Agent[]>(STORAGE_KEYS.AGENTS)
  }

  saveAgents(agents: Agent[]): void {
    this.setItem(STORAGE_KEYS.AGENTS, agents)
  }

  // Calls methods
  getCalls(): Call[] | null {
    return this.getItem<Call[]>(STORAGE_KEYS.CALLS)
  }

  saveCalls(calls: Call[]): void {
    this.setItem(STORAGE_KEYS.CALLS, calls)
  }

  // Auth methods
  getAuth(): StoredAuth | null {
    if (!this.isClient) return null
    
    try {
      const item = sessionStorage.getItem(STORAGE_KEYS.AUTH)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Error reading auth from sessionStorage:', error)
      return null
    }
  }

  saveAuth(auth: StoredAuth): void {
    if (!this.isClient) return
    
    try {
      sessionStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(auth))
    } catch (error) {
      console.error('Error writing auth to sessionStorage:', error)
    }
  }

  clearAuth(): void {
    if (!this.isClient) return
    
    try {
      sessionStorage.removeItem(STORAGE_KEYS.AUTH)
    } catch (error) {
      console.error('Error removing auth from sessionStorage:', error)
    }
  }

  // Clear all data
  clearAllData(): void {
    this.removeItem(STORAGE_KEYS.AGENTS)
    this.removeItem(STORAGE_KEYS.CALLS)
    this.clearAuth()
  }

  // Clear only call and agent data (keep auth)
  clearMockData(): void {
    this.removeItem(STORAGE_KEYS.AGENTS)
    this.removeItem(STORAGE_KEYS.CALLS)
  }
}

export const localStorageService = new LocalStorageService()

// Initialize data version check
if (typeof window !== 'undefined') {
  localStorageService.checkDataVersion()
}