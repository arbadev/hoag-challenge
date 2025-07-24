import { createContext, useContext, useState, useCallback, useEffect } from "react"
import type { ReactNode } from "react"
import { localStorageService } from "~/lib/local-storage"
import { toast } from "sonner"

interface DataManagementContextType {
  isUsingPersistedData: boolean
  lastResetTime: Date | null
  resetMockData: () => void
  checkDataStatus: () => void
}

const DataManagementContext = createContext<DataManagementContextType | undefined>(undefined)

export function DataManagementProvider({ children }: { children: ReactNode }) {
  const [isUsingPersistedData, setIsUsingPersistedData] = useState(false)
  const [lastResetTime, setLastResetTime] = useState<Date | null>(null)

  const checkDataStatus = useCallback(() => {
    // Check if we have persisted data
    const hasAgents = localStorageService.getAgents() !== null
    const hasCalls = localStorageService.getCalls() !== null
    setIsUsingPersistedData(hasAgents || hasCalls)
  }, [])

  const resetMockData = useCallback(() => {
    // Clear persisted mock data
    localStorageService.clearMockData()
    setLastResetTime(new Date())
    setIsUsingPersistedData(false)
    
    // Show success message
    toast.success("Mock data reset successfully. Refreshing page...")
    
    // Reload the page to regenerate fresh data
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }, [])

  // Check data status on mount
  useEffect(() => {
    checkDataStatus()
  }, [checkDataStatus])

  const value = {
    isUsingPersistedData,
    lastResetTime,
    resetMockData,
    checkDataStatus,
  }

  return (
    <DataManagementContext.Provider value={value}>
      {children}
    </DataManagementContext.Provider>
  )
}

export function useDataManagement() {
  const context = useContext(DataManagementContext)
  if (context === undefined) {
    throw new Error("useDataManagement must be used within a DataManagementProvider")
  }
  return context
}