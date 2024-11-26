import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    const { hasError } = this.state;
    const { children, fallbackComponent: FallbackComponent } = this.props;

    if (hasError) {
      // return <FallbackComponent />;
      return "Error";
    }

    return children;
  }
}

export default ErrorBoundary;
