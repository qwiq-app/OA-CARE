import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || "Unexpected error",
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "40px", textAlign: "center" }}>
          <h2>{this.props.title || "Something went wrong."}</h2>
          <pre style={{ color: "red", whiteSpace: "pre-wrap" }}>
            {this.state.message}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
