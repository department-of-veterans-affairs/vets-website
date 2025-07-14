/* eslint-disable react/prop-types */
/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
/* eslint-disable react/jsx-wrap-multilines */
import React, { lazy, Suspense } from 'react';

/**
 * @param {Function} loader – () => Promise – dynamic import callback that
 * resolves to a React component (either default export or the module itself).
 * @param {String} [loadingMessage='Loading page...'] – Message to display while
 * the chunk is being fetched.
 * @returns {Function} React component to use directly in route definitions.
 */

export default function lazyRoute(loader, loadingMessage = 'Loading page...') {
  const Component = lazy(() =>
    loader().then(module => (module.default ? module.default : module)),
  );

  class LazyRouteErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    componentDidCatch(error) {
      if (typeof window?.captureError === 'function') {
        window.captureError(error);
      }
    }

    handleRetry = () => {
      this.setState({ hasError: false });
    };

    render() {
      if (this.state.hasError) {
        return (
          <div className="lazy-route-error">
            <va-alert status="error" visible>
              <h3 slot="headline">We're sorry, something went wrong</h3>
              <p>
                We couldn't load this page. Please try again. If the problem
                persists, refresh your browser or check back later.
              </p>
              <button
                type="button"
                onClick={this.handleRetry}
                className="usa-button"
              >
                Retry
              </button>
            </va-alert>
          </div>
        );
      }
      return this.props.children;
    }
  }

  const LazyComponent = props => (
    <LazyRouteErrorBoundary>
      <Suspense
        fallback={
          <div className="lazy-route-loader">
            <va-loading-indicator message={loadingMessage} />
          </div>
        }
      >
        <Component {...props} />
      </Suspense>
    </LazyRouteErrorBoundary>
  );

  LazyComponent.displayName = 'LazyRouteComponent';

  return LazyComponent;
}
