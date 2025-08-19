import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AddSession from "../components/sessions/AddSession";
import { Button } from "../components/ui/button";
import { useAuth } from "../store/auth-context";
import { FiLogOut, FiEdit3, FiUser } from "react-icons/fi";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { motion, AnimatePresence } from "framer-motion";
import styles from './Navigation.module.css';

export default function Navigation() {
  const [isAdding, setAdding] = useState(false);
  const [showUserTooltip, setShowUserTooltip] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  function addingStarted() { setAdding(true); }
  function addingCancelled() { setAdding(false); }

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
      setShowUserTooltip(false);
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
    setIsLoggingOut(false);
  }

  function toggleTooltip() { setShowUserTooltip(prev => !prev); }
  function handleBlur(e: React.FocusEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget)) setShowUserTooltip(false);
  }

  if (loading) return null;

  return (
    <>
      {isAdding && <AddSession onClose={addingCancelled} />}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <p>Tracker</p>
        </div>

        {/* Hamburger/X for mobile */}
        <div className={styles.hamburgerWrapper}>
          <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
            {/* Hamburger (opens menu) */}
            {!menuOpen && (
              <Dialog.Trigger asChild>
                <button
                  className={styles.animatedHamburger}
                  aria-label="Open menu"
                  type="button"
                >
                  <span className={`${styles.animatedHamburgerBar} ${styles.bar1}`}></span>
                  <span className={`${styles.animatedHamburgerBar} ${styles.bar2}`}></span>
                  <span className={`${styles.animatedHamburgerBar} ${styles.bar3}`}></span>
                </button>
              </Dialog.Trigger>
            )}
            <AnimatePresence>
              {menuOpen && (
                <Dialog.Portal forceMount>
                  <Dialog.Overlay asChild>
                    <motion.div
                      className={styles.menuOverlay}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    />
                  </Dialog.Overlay>
                  <Dialog.Content asChild aria-describedby={undefined}>
                    <motion.div
                      className={styles.menuContent}
                      initial={{ x: "100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "100%" }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <Dialog.Title asChild>
                        <VisuallyHidden.Root>Navigation Menu</VisuallyHidden.Root>
                      </Dialog.Title>
                      {/* X (closes menu) */}
                      <Dialog.Close asChild>
                        <button
                          className={styles.menuCloseBtn}
                          aria-label="Close menu"
                          type="button"
                        >
                          &times;
                        </button>
                      </Dialog.Close>
                      <div className={styles.menuLinks}>
                        <NavLink to="/overview" onClick={() => setMenuOpen(false)}>Overview</NavLink>
                        <NavLink to="/table-view" onClick={() => setMenuOpen(false)}>Lessons</NavLink>
                        <button className={styles.addButton} onClick={() => { setMenuOpen(false); addingStarted(); }}>
                          + Add Session
                        </button>
                        <button className={styles.actionButton} onClick={() => { setMenuOpen(false); navigate('/edit-profile'); }}>
                          <FiEdit3 className={styles.icon} />
                          Edit Profile
                        </button>
                        <button className={styles.actionButton} onClick={() => { setMenuOpen(false); handleLogout(); }}>
                          <FiLogOut className={styles.icon} />
                          {isLoggingOut ? '...' : 'Logout'}
                        </button>
                      </div>
                    </motion.div>
                  </Dialog.Content>
                </Dialog.Portal>
              )}
            </AnimatePresence>
          </Dialog.Root>
        </div>

        {/* Desktop navigation */}
        <div className={styles.center}>
          <NavLink to="/overview" end className={({ isActive }) => isActive ? styles.active : ''}>
            Overview
          </NavLink>
          <NavLink to="/table-view" className={({ isActive }) => isActive ? styles.active : ''}>
            Lessons
          </NavLink>
        </div>

        <div className={styles.rightSection}>
          <Button className={styles.addButton} onClick={addingStarted}>
            + Add Session
          </Button>
          <div
            className={styles.userWrapper}
            tabIndex={0}
            onClick={toggleTooltip}
            onBlur={handleBlur}
          >
            <div className={styles.userIcon} aria-label="User menu" role="button" tabIndex={-1}>
              <FiUser size={20} color="grey" />
            </div>
            {showUserTooltip && (
              <div className={styles.tooltip}>
                <div className={styles.userInfo}>
                  <span className={styles.email}>{user!.email}</span>
                </div>
                <div className={styles.actions}>
                  <button onClick={() => navigate('/edit-profile')} className={styles.actionButton}>
                    <FiEdit3 className={styles.icon} />
                    Edit Profile
                  </button>
                  <button className={styles.actionButton} onClick={handleLogout}>
                    <FiLogOut className={styles.icon} />
                    {isLoggingOut ? '...' : 'Logout'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}