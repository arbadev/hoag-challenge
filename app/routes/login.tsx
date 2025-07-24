import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { useState } from "react"
import { toast } from "sonner"
import { Users, Shield, ArrowLeft } from "lucide-react"

import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Label } from "~/components/ui/label"
import { useAuth } from "~/contexts/auth-context"
import { RoleSelectionCard } from "~/components/auth/role-selection-card"
import { getAgentByUsername } from "~/lib/mock-data-persistent"

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["agent", "admin"])
})

type LoginFormValues = z.infer<typeof loginSchema>
type AuthStep = "role-selection" | "credentials"

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [authStep, setAuthStep] = useState<AuthStep>("role-selection")
  const [selectedRole, setSelectedRole] = useState<"agent" | "admin" | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "agent",
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Mock authentication - in real app, validate credentials
      const validCredentials = (
        (data.username === "agent" && data.password === "password123" && data.role === "agent") ||
        (data.username === "admin" && data.password === "password123" && data.role === "admin")
      )
      
      if (!validCredentials) {
        throw new Error("Invalid credentials")
      }
      
      // For agent role, try to map to a specific agent
      let userId = data.role === "admin" ? "admin-1" : "agent-1"
      let displayName = data.username
      
      if (data.role === "agent") {
        const agent = getAgentByUsername(data.username)
        if (agent) {
          userId = agent.id
          displayName = agent.name
        }
      }
      
      const user = {
        id: userId,
        name: displayName,
        role: data.role,
        permissions: data.role === "admin" 
          ? ["view_queue", "manage_queue", "view_agents", "view_analytics"]
          : ["view_queue", "handle_calls"],
      }
      
      login(user)
      toast.success("Login successful!")
      navigate("/dashboard")
    } catch (error) {
      toast.error("Invalid credentials. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleSelection = (role: "agent" | "admin") => {
    setSelectedRole(role)
    form.setValue("role", role)
    setAuthStep("credentials")
  }

  const handleBack = () => {
    setAuthStep("role-selection")
    setSelectedRole(null)
    form.reset()
  }

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6">
        {/* Logo/Branding */}
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Call Center Management System
          </h1>
          <p className="text-sm text-muted-foreground">
            Select your role to continue
          </p>
        </div>

        {authStep === "role-selection" ? (
          /* Role Selection Step */
          <div className="grid gap-6 sm:grid-cols-2 mx-auto max-w-[600px] w-full px-4">
            <RoleSelectionCard
              role="agent"
              title="Call Agent"
              description="Handle customer calls and manage the queue"
              icon={<Users className="h-6 w-6 text-primary" />}
              selected={selectedRole === "agent"}
              onSelect={() => handleRoleSelection("agent")}
              disabled={isLoading}
            />
            <RoleSelectionCard
              role="admin"
              title="Administrator"
              description="Manage agents, view analytics, and oversee operations"
              icon={<Shield className="h-6 w-6 text-primary" />}
              selected={selectedRole === "admin"}
              onSelect={() => handleRoleSelection("admin")}
              disabled={isLoading}
            />
          </div>
        ) : (
          /* Credentials Step */
          <div className="mx-auto w-full sm:w-[400px]">
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    disabled={isLoading}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <div className="flex items-center gap-2">
                    {selectedRole === "admin" ? (
                      <Shield className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Users className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium capitalize">
                      {selectedRole}
                    </span>
                  </div>
                </div>
                <CardTitle className="text-2xl text-center">
                  Login as {selectedRole === "admin" ? "Administrator" : "Agent"}
                </CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to continue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your username"
                              type="text"
                              autoCapitalize="none"
                              autoComplete="username"
                              autoCorrect="off"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your password"
                              type="password"
                              autoComplete="current-password"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
                <p>Demo credentials:</p>
                <p className="font-mono text-xs">
                  {selectedRole === "admin" ? "admin / password123" : "agent / password123"}
                </p>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export function meta() {
  return [
    { title: "Login - Call Center Management" },
    { name: "description", content: "Login to Call Center Management System" },
  ]
}