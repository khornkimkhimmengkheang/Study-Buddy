import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@/types";
import { authApi } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<{ error?: string; message?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (
    email: string
  ) => Promise<{ error?: string; message?: string }>;
  updatePassword: (
    newPassword: string
  ) => Promise<{ error?: string; message?: string }>;
  updateProfile: (updates: {
    email?: string;
    fullName?: string;
  }) => Promise<{ error?: string; message?: string }>;
  resendConfirmation: (
    email: string
  ) => Promise<{ error?: string; message?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authApi.getCurrentUser().then((user) => {
      setUser(user);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = authApi.onAuthStateChange((user, event) => {
      setUser(user);
      setIsLoading(false);

      if (event === "PASSWORD_RECOVERY") {
        console.log("Password recovery mode active");
      } else if (event === "SIGNED_IN") {
        console.log("User signed in");
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out");
      } else if (event === "USER_UPDATED") {
        console.log("User profile updated");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await authApi.signIn(email, password);
    if (result.error) {
      return { error: result.error };
    }
    setUser(result.user);
    return {};
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const result = await authApi.signUp(email, password, fullName);
    if (result.error) {
      return { error: result.error };
    }
    if (result.user && !result.message) {
      setUser(result.user);
    }
    return { message: result.message };
  };

  const signOut = async () => {
    await authApi.signOut();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    const result = await authApi.resetPassword(email);
    return result;
  };

  const updatePassword = async (newPassword: string) => {
    const result = await authApi.updatePassword(newPassword);
    return result;
  };

  const updateProfile = async (updates: {
    email?: string;
    fullName?: string;
  }) => {
    const result = await authApi.updateProfile(updates);
    if (result.user) {
      setUser(result.user);
    }
    return { error: result.error, message: result.message };
  };

  const resendConfirmation = async (email: string) => {
    const result = await authApi.resendConfirmation(email);
    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile,
        resendConfirmation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
