// context/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  type User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  updatePassword,
  deleteUser
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";



type AuthContextType = {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  update: (newEmail: string, currentPassword: string) => Promise<void>;
  updatePass: (newPassword: string, currentPassword: string) => Promise<void>;
  deleteAccount: (currentPassword: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);


  // SIGNUP LOGIC
  async function signup(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        await sendEmailVerification(user);
        await signOut(auth);
        navigate("/login"); // 🚀 Redirect after signup
        toast.success("Registration done, please verify your email and then login");

      }
    } catch (error: any) {
      throw error;
    }
  }

  // LOGIN LOGIC
  async function login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;


      if (!user.emailVerified) {
        await signOut(auth);
        toast.error("Email not verified");
        throw new Error("Please verify your email first");
      }

      return user;
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Login error");
    }
  }
  // LOGOUT LOGIC
  async function logout() {
    await signOut(auth);
  }


  // UPDATE LOGIC
  async function update(newEmail: string, currentPassword: string): Promise<void> {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error("Not authenticated user.");
    }

    try {

      const currentEmail = user.email;


      const credential = EmailAuthProvider.credential(currentEmail, currentPassword);
      await reauthenticateWithCredential(user, credential);

      await updateEmail(user, newEmail);

      await sendEmailVerification(user);

      await user.reload();

      await signOut(auth);
      navigate('/login')
      toast.success(`Verification email has been sent to ${newEmail}, please verify before logging in`);


    } catch (error: any) {
      console.error("Update email error:", error);
      if (error.code === "auth/invalid-credential") {
        throw new Error("Wrong password or credentials");
      }
      throw new Error(error.message || "Email change error.");
    }
  }
  // UPDATE PASSWORD LOGIC
  async function updatePass(currentPassword: string, newPassword: string) {
    const user = auth.currentUser as User;

    try {
      const currentEmail = user!.email;
      const credential = EmailAuthProvider.credential(currentEmail as string, currentPassword);

      // Re-authenticate user
      await reauthenticateWithCredential(user, credential);


      // Update password
      await updatePassword(user, newPassword);

      await signOut(auth);
      navigate('/login')
      toast.success('Password changed, login with new password!')



    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async function deleteAccount(currentPassword: string): Promise<void> {
    const user = auth.currentUser;

    if (!user || !user.email) {
      throw new Error("No authenticated user.");
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);

      // Re-authenticate
      await reauthenticateWithCredential(user, credential);

      // Delete user
      await deleteUser(user);

      navigate("/");
      toast.success("Account deleted successfully.");


    } catch (error: any) {
      console.error("Delete account error:", error);

      if (error.code === "auth/requires-recent-login") {
        throw new Error("Please log in again before deleting your account.");
      }

      throw new Error(error.message || "Account deletion failed.");
    }
  }



  return (
    <AuthContext.Provider
      value={{ user, loading, signup, login, logout, update, updatePass, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
