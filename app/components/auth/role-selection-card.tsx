import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Users, UserCheck } from "lucide-react"
import { cn } from "~/lib/utils"

interface RoleSelectionCardProps {
  role: "agent" | "admin"
  title: string
  description: string
  icon: React.ReactNode
  selected: boolean
  onSelect: () => void
  disabled?: boolean
}

export function RoleSelectionCard({
  role,
  title,
  description,
  icon,
  selected,
  onSelect,
  disabled
}: RoleSelectionCardProps) {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-lg",
        selected && "ring-2 ring-primary",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={() => !disabled && onSelect()}
    >
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
          {selected && (
            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
              <UserCheck className="h-4 w-4 text-primary-foreground" />
            </div>
          )}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant={selected ? "default" : "outline"}
          className="w-full"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation()
            !disabled && onSelect()
          }}
        >
          {selected ? "Selected" : "Select Role"}
        </Button>
      </CardContent>
    </Card>
  )
}