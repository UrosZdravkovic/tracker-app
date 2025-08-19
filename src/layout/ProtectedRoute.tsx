import { useAuth } from "../store/auth-context";
import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // ili spinner
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
