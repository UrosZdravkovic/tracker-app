import { useState, useEffect } from "react";
import styles from "./AuthForm.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth-context";
import { Eye, EyeOff } from "lucide-react";

type AuthFormProps = {
  mode: "login" | "register";
  onClose?: () => void;
};

export default function AuthForm({ mode: initialMode, onClose }: AuthFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login, signup } = useAuth();

  useEffect(() => {
    setError("");
    setEmail("");
    setPassword("");
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (mode === "login") {
      try {
        await login(email, password);
        if (onClose) {
          onClose();
        }
        navigate("/overview");
      } catch (err: any) {
        setError("Invalid username or password");
      }
    } else {
      try {
        await signup(email, password);
        if (onClose) {
          onClose();
        }
        navigate("/overview");
      } catch (err: any) {
        if (err.code === "auth/email-already-in-use") {
          setError("Email is already in use");
        } else if (err.code === "auth/weak-password") {
          setError("Password is too weak (min 6 characters)");
        } else if (err.code === "auth/invalid-email") {
          setError("Invalid email address");
        } else {
          setError("Registration failed, try again");
        }
      }
    }

    setIsSubmitting(false);
  };

  const emailError =
    (mode === "register" && error.includes("email")) ||
    (mode === "login" && error === "Invalid username or password");
  const passwordError =
    (mode === "register" && error.includes("Password")) ||
    (mode === "login" && error === "Invalid username or password");

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
        if (error) setError("");
      };

  return (
    <div className={styles.outerContainer}>
      <div className={styles.leftSide}>
        <h2 className={styles.formModeTitle}>
          {mode === "login" ? "Login" : "Register"}
        </h2>

        <div className={styles.formWrapper}>
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <p className={styles.error} aria-live="polite">
              {error || "\u00A0"}
            </p>

            <input
              type="email"
              placeholder="Email"
              value={email}
              disabled={isSubmitting}
              onChange={handleInputChange(setEmail)}
              className={`${styles.input} ${emailError ? styles.inputError : ""}`}
              autoComplete="username"
            />

            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                disabled={isSubmitting}
                onChange={handleInputChange(setPassword)}
                className={`${styles.input} ${passwordError ? styles.inputError : ""}`}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className={styles.eyeButton}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button type="submit" className={styles.button} disabled={isSubmitting}>
              {isSubmitting ? (
                <span className={styles.spinner}></span>
              ) : mode === "login" ? (
                "Login"
              ) : (
                "Register"
              )}
            </button>

            <p className={styles.toggleText}>
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className={styles.toggleButton}
                    onClick={() => setMode("register")}
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className={styles.toggleButton}
                    onClick={() => setMode("login")}
                  >
                    Login
                  </button>
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
