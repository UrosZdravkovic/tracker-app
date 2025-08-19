import {
  createContext,
  type ReactNode,
  useContext,
  useReducer,
  useEffect,
} from "react";
import {
  collection,
  deleteDoc,
  query,
  where,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./auth-context";

export type Session = {
  id: string;
  lesson: string;
  time: number;
  category: string;
  status: string;
  userId: string;
};

type SessionsState = {
  currentSessions: Session[];
  isLoading: boolean;
};

type SessionCtxValue = SessionsState & {
  addSession: (session: Omit<Session, "userId">) => Promise<void>;
  removeSession: (sessionId: string) => Promise<void>;
  updateSession: (
    sessionId: string,
    updatedData: Partial<Session>
  ) => Promise<void>;
};

// Context i hook
export const SessionsCtx = createContext<SessionCtxValue | null>(null);

export function useSessionsCtx() {
  const context = useContext(SessionsCtx);

  if (!context) {
    throw new Error("Context must be within the Provider");
  }

  return context;
}

// Definicije akcija
type AddSessionAction = {
  type: "ADD_SESSION";
  session: Session;
};

type RemoveSessionAction = {
  type: "REMOVE_SESSION";
  sessionId: string;
};

type UpdateSessionAction = {
  type: "UPDATE_SESSION";
  sessionId: string;
  updatedData: Partial<Session>;
};

type SetAllSessionsAction = {
  type: "SET_ALL_SESSIONS";
  sessions: Session[];
};

type SetLoadingAction = {
  type: "SET_LOADING";
  isLoading: boolean;
};

type SessionsAction =
  | AddSessionAction
  | RemoveSessionAction
  | UpdateSessionAction
  | SetAllSessionsAction
  | SetLoadingAction;

// Reducer
function sessionsReducer(
  state: SessionsState,
  action: SessionsAction
): SessionsState {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case "SET_ALL_SESSIONS":
      return {
        currentSessions: action.sessions,
        isLoading: false,
      };

    case "ADD_SESSION":
      if (
        state.currentSessions.some(
          (session) => session.id === action.session.id
        )
      ) {
        return state;
      }
      return {
        ...state,
        currentSessions: [...state.currentSessions, action.session],
      };

    case "REMOVE_SESSION":
      return {
        ...state,
        currentSessions: state.currentSessions.filter(
          (session) => session.id !== action.sessionId
        ),
      };

    case "UPDATE_SESSION":
      return {
        ...state,
        currentSessions: state.currentSessions.map((session) =>
          session.id === action.sessionId
            ? { ...session, ...action.updatedData }
            : session
        ),
      };

    default:
      return state;
  }
}

// Provider
export default function SessionsContextProvider({ children }: { children: ReactNode }) {
  const [sessionsState, dispatch] = useReducer(sessionsReducer, {
    currentSessions: [],
    isLoading: true,
  });

  const { user, loading } = useAuth(); // dodaj i loading ovde

  useEffect(() => {
    if (loading) return; // još čekamo auth

    if (!user) {
      dispatch({ type: "SET_LOADING", isLoading: false });
      return;
    }

    const fetchSessions = async () => {
      dispatch({ type: "SET_LOADING", isLoading: true });

      try {
        const q = query(
          collection(db, "sessions"),
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(q);
        const sessions: Session[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Session, "id">),
        }));

        dispatch({ type: "SET_ALL_SESSIONS", sessions });
      } catch (error) {
        console.error("Failed to load sessions:", error);
        dispatch({ type: "SET_LOADING", isLoading: false });
      }
    };

    fetchSessions();
  }, [user, loading]);

  async function addSession(session: Omit<Session, "userId">) {
    if (!user?.uid) {
      console.error("User not logged in, cannot add session");
      return;
    }

    const sessionWithUser: Session = { ...session, userId: user.uid };

    try {
      await setDoc(doc(db, "sessions", session.id), sessionWithUser);
      dispatch({ type: "ADD_SESSION", session: sessionWithUser });
    } catch (error) {
      console.error("Error adding session:", error);
    }
  }

  async function removeSession(sessionId: string) {
    try {
      await deleteDoc(doc(db, "sessions", sessionId));
      dispatch({ type: "REMOVE_SESSION", sessionId });
    } catch (error) {
      console.error("Error removing session:", error);
    }
  }

  async function updateSession(
    sessionId: string,
    updatedData: Partial<Session>
  ) {
    try {
      await updateDoc(doc(db, "sessions", sessionId), updatedData);
      dispatch({ type: "UPDATE_SESSION", sessionId, updatedData });
    } catch (error) {
      console.error("Error updating session:", error);
    }
  }

  const ctxValue: SessionCtxValue = {
    addSession,
    removeSession,
    updateSession,
    currentSessions: sessionsState.currentSessions,
    isLoading: sessionsState.isLoading,
  };

  return (
    <SessionsCtx.Provider value={ctxValue}>{children}</SessionsCtx.Provider>
  );
}
