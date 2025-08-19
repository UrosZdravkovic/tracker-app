import { useState } from "react";
import AuthForm from "../components/AuthForm";
import styles from "./LandingPage.module.css";
import image from "../assets/landing-image.png";
import { AuthProvider } from "../store/auth-context";

export default function LandingPage() {
  const [mode, setMode] = useState<"login" | "register" | null>(null);

  return (
    <AuthProvider>
      <div className={styles.container}>
        <div className={styles.authSection}>
          <h1 className={styles.title}>Welcome to Routine Tracker</h1>
          <p className={styles.subtitle}>Stay organized and motivated. Track your learning, habits, and routines in one simple place.</p>

          {!mode && (
            <div className={styles.switchButtons}>
              <button
                onClick={() => setMode("login")}
                type="button"
              >
                Log In
              </button>
              <button
                onClick={() => setMode("register")}
                type="button"
              >
                Create Account
              </button>
            </div>
          )}

          {mode && (
            <>
              <button
                className={styles.backButton}
                onClick={() => setMode(null)}
                type="button"
              >
                ← Back to welcome
              </button>
              <AuthForm mode={mode} />
            </>
          )}
        </div>

        <div className={styles.imageSection}>
          <img src={image} alt="Landing visual" className={styles.image} />
        </div>
      </div>
    </AuthProvider>
  );
}


