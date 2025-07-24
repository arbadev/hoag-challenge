import { Phone, Users, BarChart3, Home } from "lucide-react"
import { Link, useLocation } from "react-router"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Separator } from "~/components/ui/separator"
import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import { Badge } from "~/components/ui/badge"
import { useAuth } from "~/contexts/auth-context"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation()
  const { user } = useAuth()

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard/home",
      icon: Home,
      show: true,
    },
    {
      name: "Call Queue",
      href: "/dashboard/queue",
      icon: Phone,
      show: true,
    },
    {
      name: "Agents",
      href: "/dashboard/agents",
      icon: Users,
      show: user?.role === "admin",
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
      show: user?.role === "admin",
    },
  ]

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Navigation
            </h2>
            <div className="space-y-1">
              {navigation.map((item) => {
                if (!item.show) return null
                const isActive = location.pathname === item.href
                return (
                  <Button
                    key={item.name}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-secondary"
                    )}
                    asChild
                  >
                    <Link to={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Link>
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
      
      <Separator />
      
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {user?.name ? getInitials(user.name) : "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">{user?.name}</span>
            <Badge variant="outline" className="w-fit text-xs">
              {user?.role === "admin" ? "Admin" : "Agent"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}