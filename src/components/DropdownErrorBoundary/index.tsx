import React, { Component, ErrorInfo, ReactNode } from 'react';
import './DropdownErrorBoundary.css';

interface DropdownErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface DropdownErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class DropdownErrorBoundary extends Component<DropdownErrorBoundaryProps, DropdownErrorBoundaryState> {
  constructor(props: DropdownErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): DropdownErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('DropdownErrorBoundary caught an error:', error, errorInfo);
    }
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="dropdown-error-boundary" role="alert">
          <h3 className="dropdown-error-boundary-title">Something went wrong</h3>
          <p className="dropdown-error-boundary-message">
            {process.env.NODE_ENV === 'development' 
              ? this.state.error?.message 
              : 'An error occurred while rendering the dropdown. Please try refreshing the page.'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default DropdownErrorBoundary;
