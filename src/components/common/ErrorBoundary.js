// src/components/common/ErrorBoundary.js
import React from 'react';

/**
 * ErrorBoundary component to catch JavaScript errors anywhere in their child component tree.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * Update state when an error is caught.
   *
   * @param {Error} error - The error that was thrown.
   * @returns {object} - New state.
   */
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  /**
   * Log the error details.
   *
   * @param {Error} error - The error that was thrown.
   * @param {object} errorInfo - Additional error information.
   */
  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  /**
   * Render fallback UI if an error has been caught.
   *
   * @returns {JSX.Element} - Fallback UI or children.
   */
  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center mt-20">
          <h1 className="text-3xl font-bold text-goonsRed">Something went wrong.</h1>
          <p className="mt-4 text-gray-700">Please try refreshing the page or contact support if the problem persists.</p>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
