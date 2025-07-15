/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
import React, { lazy, useState } from 'react';

/**
 * @param {Function} importer
 * @param {Object}   options
 * @param {JSX.Element} [options.fallback]
 */
export default function lazyRoute(
  importer,
  { fallback = <va-loading-indicator message="Loading page…" /> } = {},
) {
  const LazyComponent = lazy(() =>
    importer().then(mod => (mod.default ? mod : { default: mod })),
  );

  // eslint-disable-next-line react/prop-types
  function ErrorBoundary({ children }) {
    const [error, setError] = useState(null);

    if (error) {
      return (
        <div className="vads-u-margin-y--3">
          <p>We couldn’t load that page. Please try again.</p>
          <button
            className="usa-button"
            type="button"
            onClick={() => setError(null)}
          >
            Retry
          </button>
        </div>
      );
    }

    return (
      <React.Suspense fallback={fallback}>
        <InnerBoundary onError={setError}>{children}</InnerBoundary>
      </React.Suspense>
    );
  }

  // Separate component so we can use componentDidCatch
  class InnerBoundary extends React.Component {
    /* eslint-disable react/state-in-constructor */
    state = { hasError: false };

    componentDidCatch(err) {
      this.setState({ hasError: true });
      this.props.onError(err);
    }

    render() {
      if (this.state.hasError) return null;
      return this.props.children;
    }
  }
  /* eslint-enable react/state-in-constructor */

  return function LazyRouteWrapper(props) {
    return (
      <ErrorBoundary>
        <LazyComponent {...props} />
      </ErrorBoundary>
    );
  };
}
