import { createContext, useContext, useState, useCallback, useEffect } from "react"
import type { ReactNode } from "react"
import { localStorageService } from "~/lib/local-storage"

interface User {
  id: string
  name: string
  role: "agent" | "admin"
  permissions: string[]
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Check for persisted session on mount
  useEffect(() => {
    const persistedAuth = localStorageService.getAuth()
    if (persistedAuth) {
      setUser(persistedAuth)
    }
  }, [])

  const login = useCallback((userData: User) => {
    setUser(userData)
    // Persist to sessionStorage
    localStorageService.saveAuth(userData)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    // Clear from sessionStorage
    localStorageService.clearAuth()
  }, [])

  const hasPermission = useCallback(
    (permission: string) => {
      return user?.permissions.includes(permission) || false
    },
    [user]
  )

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}