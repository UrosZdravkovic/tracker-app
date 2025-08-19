import { useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import DeleteAccountConfirmationModal from "./DeleteAccountConfirmationModal";
import { useAuth } from "../../store/auth-context";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
import Spinner from "../../uiLoaders/Spinner"

export default function DeleteAccountCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { deleteAccount } = useAuth();
  const currentPasswordRef = useRef<HTMLInputElement>(null);

  function handleOpenModal() {
    const password = currentPasswordRef.current?.value || "";

    if (!password) {
      setError("Password is required.");
      return;
    }

    setError(""); // uklanjamo staru grešku
    setIsOpen(true);
  }

  function handleCloseModal() {
    setIsOpen(false);
  }

  async function handleDeleteAccount() {
    const password = currentPasswordRef.current!.value;

    try {
      setIsDeleting(true);
      await deleteAccount(password);

      // uspešno -> zatvori modal

    } catch (error: any) {
      console.error(error);
      setError("Wrong password!");
      setIsOpen(false);
    }
    setIsDeleting(false);

    setIsOpen(false);
  }

  return (
    <>
      {isOpen && (
        <DeleteAccountConfirmationModal
          isDeleting={isDeleting}
          handleClose={handleCloseModal}
          handleDeleteAccount={handleDeleteAccount}
        />
      )}
      <Card className="max-w-md mx-auto p-6 border border-red-500 bg-red-50 shadow-md rounded-2xl">
        <CardHeader className="flex flex-col items-center text-center space-y-2">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertTriangle className="text-red-600 w-6 h-6" />
          </div>
          <CardTitle className="text-red-700 text-xl font-bold">
            Delete Your Account
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            This action is permanent and cannot be undone. Your account and data will be lost.
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-800">
              Confirm your password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                ref={currentPasswordRef}
                className="border border-gray-300 pr-10 focus:ring-2 focus:ring-red-400 focus:border-red-500"
                onChange={() => {
                  if (error) setError("");
                }}
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
          <Button
            variant="destructive"
            onClick={handleOpenModal}
            disabled={isDeleting}
            className="w-full mt-2 bg-red-600 hover:bg-red-700 transition-colors duration-200"
          >
            {isDeleting ? <Spinner text={true} size={14} /> : "Delete Account"}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
