import React from 'react';
import { Result, Button } from 'antd';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="Something went wrong."
          subTitle={this.state.error && this.state.error.toString()}
          extra={
            <Button type="primary" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          }
        >
          <details style={{ whiteSpace: 'pre-wrap', textAlign: 'left', maxHeight: '200px', overflowY: 'auto' }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </Result>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;