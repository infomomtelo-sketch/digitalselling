import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-[300px] flex flex-col items-center justify-center gap-4 p-8">
            <AlertTriangle className="text-destructive" size={32} />
            <h2 className="font-heading text-lg font-semibold">Something went wrong</h2>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <Button variant="outline" onClick={() => this.setState({ hasError: false, error: null })}>
              Try again
            </Button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
