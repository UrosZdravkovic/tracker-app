import { Outlet } from "react-router-dom";
import Navigation from "../layout/Navigation";
import SessionsContextProvider from "../store/sessions-context";
import { AuthProvider } from "../store/auth-context";

export default function Root() {
  return (
    <AuthProvider>
      <SessionsContextProvider>
        <Navigation />
        <Outlet />
      </SessionsContextProvider>
    </AuthProvider>
  );
}
