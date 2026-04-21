import React from "react";
import "./ErrorBoundary.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught:", error, info);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="eb-content">
            <p className="eb-icon">⚠️</p>
            <h1>Something went wrong</h1>
            <p className="eb-msg">
              An unexpected error occurred. You can try reloading the page or return to the home screen.
            </p>
            {this.state.error?.message && (
              <pre className="eb-detail">{String(this.state.error.message)}</pre>
            )}
            <div className="eb-actions">
              <button className="eb-btn eb-btn--primary" onClick={() => window.location.reload()}>
                Reload
              </button>
              <a href="/" className="eb-btn eb-btn--ghost" onClick={this.reset}>Go Home</a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
