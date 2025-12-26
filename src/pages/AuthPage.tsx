import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, BookOpen, CheckCircle2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const [confirmationSuccess, setConfirmationSuccess] = useState(false);

  const {
    signIn,
    signUp,
    resetPassword,
    resendConfirmation,
    user,
    isLoading: authLoading,
  } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isConfirmed = searchParams.get("confirmed") === "true";

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/app", { replace: true });
    }
  }, [user, authLoading, navigate]);

  if (authLoading || (isConfirmed && !user)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-background to-accent/30">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">
            StudyPlanner
          </span>
        </div>
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Email Confirmed!</h2>
            <p className="text-muted-foreground text-center mb-4">
              Your email has been verified. Redirecting to dashboard...
            </p>
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      let result;
      if (activeTab === "login") {
        result = await signIn(email, password);
        if (result.error) {
          setError(result.error);
        } else {
          navigate("/app");
        }
      } else {
        result = await signUp(email, password, fullName);
        if (result.error) {
          setError(result.error);
        } else if (result.message) {
          setSuccessMessage(result.message);
          setConfirmationEmail(email);
        } else {
          navigate("/app");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    setResetLoading(true);

    try {
      const result = await resetPassword(resetEmail);
      if (result.error) {
        setResetError(result.error);
      } else {
        setResetSuccess(true);
      }
    } catch (err) {
      setResetError("An unexpected error occurred. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    setConfirmationLoading(true);

    try {
      const result = await resendConfirmation(confirmationEmail || email);
      if (!result.error) {
        setConfirmationSuccess(true);
      }
    } catch (err) {
    } finally {
      setConfirmationLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as "login" | "signup");
    setError("");
    setSuccessMessage("");
  };

  const closeForgotPasswordDialog = () => {
    setShowForgotPassword(false);
    setResetEmail("");
    setResetError("");
    setResetSuccess(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-background to-accent/30">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 animate-fade-in">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
          <BookOpen className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold text-foreground">StudyPlanner</span>
      </div>

      <Card className="w-full max-w-md animate-slide-up">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>
            {activeTab === "login"
              ? "Sign in to your account"
              : "Create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Log In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <TabsContent value="login" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">Password</Label>
                    <Button
                      type="button"
                      variant="link"
                      className="px-0 h-auto text-xs text-muted-foreground hover:text-primary"
                      onClick={() => {
                        setResetEmail(email);
                        setShowForgotPassword(true);
                      }}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Alex Student"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                  <p className="text-xs text-muted-foreground">
                    At least 6 characters
                  </p>
                </div>
              </TabsContent>

              {error && (
                <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="mt-4 p-3 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p>{successMessage}</p>
                      <Button
                        type="button"
                        variant="link"
                        className="px-0 h-auto text-xs mt-1"
                        onClick={handleResendConfirmation}
                        disabled={confirmationLoading || confirmationSuccess}
                      >
                        {confirmationLoading
                          ? "Sending..."
                          : confirmationSuccess
                          ? "Sent!"
                          : "Resend email"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {activeTab === "login" ? "Log In" : "Sign Up"}
              </Button>
            </form>
          </Tabs>

          {/* Demo hint */}
          <div className="mt-6 p-3 rounded-lg bg-accent/50 text-center">
            <p className="text-xs text-muted-foreground">
              <strong>Demo:</strong> Use any email and password (min 6 chars) to
              explore
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Forgot Password Dialog */}
      <Dialog
        open={showForgotPassword}
        onOpenChange={closeForgotPasswordDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Forgot Password</DialogTitle>
            <DialogDescription>
              {resetSuccess
                ? "Check your email for reset instructions."
                : "Enter your email and we'll send you a reset link."}
            </DialogDescription>
          </DialogHeader>

          {resetSuccess ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center py-4">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-green-500" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  We sent an email to <strong>{resetEmail}</strong>. Check your
                  inbox and spam folder.
                </p>
              </div>
              <Button className="w-full" onClick={closeForgotPasswordDialog}>
                Back to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="you@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              {resetError && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {resetError}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={closeForgotPasswordDialog}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={resetLoading}
                >
                  {resetLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Send Email
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
