import { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "../../store/auth-context"
import Spinner from '../../uiLoaders/Spinner'

export default function ChangePasswordCard() {
  const { updatePass } = useAuth()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState("")

  async function handleChangePassword() {
    setIsUpdating(true)
    setError("")

    try {
      await updatePass(currentPassword, newPassword)
    } catch (error) {
      setError("Wrong current password!")
      console.error("Failed to update password:", error)
    }

    setIsUpdating(false)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleChangePassword()
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            After saving, you will be logged out.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          {/* Current password */}
          <div className="grid gap-2">
            <Label htmlFor="current-pass">Current password</Label>
            <div className="relative">
              <Input
                id="current-pass"
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value)
                  if (error) setError("") // Greška se briše samo kada kuca u ovom inputu
                }}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 p-1"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
            {error && (
              <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
          </div>

          {/* New password */}
          <div className="grid gap-2">
            <Label htmlFor="new-pass">New password</Label>
            <div className="relative">
              <Input
                id="new-pass"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 p-1"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? <Spinner text={true} size={12} /> : "Save password"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}