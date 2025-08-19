import { useRef, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { useAuth } from "../../store/auth-context"
import { Eye, EyeOff } from "lucide-react"

export default function ChangeEmailCard() {
  const { user, update } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const passwordRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  async function handleSave() {
    const newEmail = emailRef.current!.value
    const currentPassword = passwordRef.current!.value

    setError("")
    setLoading(true)
    try {
      await update(newEmail, currentPassword)
    } catch (err) {
      setError("Wrong password!")
    } finally {
      setLoading(false)
    }
  }

  function clearError() {
    if (error) setError("")
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSave()
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Change Email</CardTitle>
          <CardDescription>Update your email address.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Label>Current Email</Label>
            <div className="rounded-md border px-3 py-2 text-sm text-muted-foreground bg-muted">
              {user!.email}
            </div>

            <Label htmlFor="email">New Email</Label>
            <Input
              required
              id="email"
              type="email"
              ref={emailRef}
              onChange={clearError}
            />

            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input
                required
                id="current-password"
                type={showPassword ? "text" : "password"}
                ref={passwordRef}
                onChange={clearError}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 p-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>

            {error && (
              <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save email"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
