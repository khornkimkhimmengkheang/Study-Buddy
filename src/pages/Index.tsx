import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  CheckCircle2,
  Calendar,
  Filter,
  ArrowRight,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/app");
    }
  }, [user, isLoading, navigate]);

  const features = [
    {
      icon: CheckCircle2,
      title: "Track Progress",
      description: "Move tasks through Todo, Doing, and Done stages",
    },
    {
      icon: Calendar,
      title: "Due Dates",
      description: "Never miss a deadline with date tracking",
    },
    {
      icon: Filter,
      title: "Stay Organized",
      description: "Filter, search, and sort your tasks easily",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              StudyPlanner
            </span>
          </div>
          <Button onClick={() => navigate("/auth")}>Get Started</Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse-soft" />
            Simple & Effective Study Planning
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Organize Your Studies,{" "}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Achieve Your Goals
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            A clean, focused task manager designed for students. Track
            assignments, manage deadlines, and stay on top of your coursework.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto h-12 px-8 text-base"
              onClick={() => navigate("/auth")}
            >
              Start Planning
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-card rounded-xl p-6 border shadow-card animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Preview mockup */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 rounded-2xl blur-xl opacity-50" />
            <div className="relative bg-card rounded-xl border shadow-lg overflow-hidden">
              <div className="border-b px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-warning/60" />
                  <div className="w-3 h-3 rounded-full bg-success/60" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-muted-foreground">
                    studyplanner.app
                  </span>
                </div>
              </div>
              <div className="p-6 grid gap-3">
                {[
                  {
                    title: "Complete Calculus Problem Set",
                    status: "doing",
                    priority: "high",
                  },
                  {
                    title: "Read Chapter 5 - Climate Change",
                    status: "todo",
                    priority: "medium",
                  },
                  {
                    title: "Review Database Concepts",
                    status: "done",
                    priority: "low",
                  },
                ].map((task, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border"
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        task.status === "done"
                          ? "bg-status-done border-status-done"
                          : task.status === "doing"
                          ? "border-status-doing"
                          : "border-muted-foreground"
                      }`}
                    />
                    <span
                      className={`flex-1 font-medium ${
                        task.status === "done"
                          ? "line-through text-muted-foreground"
                          : ""
                      }`}
                    >
                      {task.title}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === "high"
                          ? "bg-priority-high/10 text-priority-high"
                          : task.priority === "medium"
                          ? "bg-priority-medium/10 text-priority-medium"
                          : "bg-priority-low/10 text-priority-low"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Plan better. Study smarter. Achieve more.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
