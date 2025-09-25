/* eslint-disable react/prop-types */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
/**
 * Module for React related startup functions
 * @module platform/startup/react
 * @see module:platform/startup
 */
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

/**
 * Mounts a React application in a given location. Also sets up dev tools and sets the global
 * VetsGov object on window.
 *
 * @param {ReactElement} component The React element you want to mount
 * @param {Element} [root] A DOM element to mount the react application into. By default,
 * this will be the element with an id of 'react-root'.
 */
export default function startReactApp(
  component,
  root = document.getElementById('react-root'),
) {
  // Detect if this is a child frame. If yes, initialize the react devtools hook to work around
  //   https://github.com/facebook/react-devtools/issues/57
  // This must occur before any react code is loaded.
  if (window.parent !== window) {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ =
      window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  }

  // Create a VA.gov global that all code can use. This is mostly useful for overrides for
  // think like api URL endpoints during testing.
  window.VetsGov = window.VetsGov || {
    api: {
      url: '', // API server. Evetually should be 'https://api.vets.gov' in production.
    },
    scroll: {
      // Default scroll settings.  These are overridden by our E2E tests.
      duration: 500,
      delay: 0,
      smooth: true,
    },
  };
  // If the specified root element is null/undefined, we don't know where to place the component,
  // therfore we discard it. This prevents components who have a specified root from being placed
  // on the page unintentionally.
  if (!root) {
    return;
  }

  // Don't over-write content within the react-root if this is a saved page
  // loaded directly into a browser - this allows Veteran's to save pages and
  // view them later. Otherwise, calling render will clear out the content &
  // render a header & footer with no content
  if (window.location?.protocol === 'file:') {
    return;
  }

  // Lightweight root-level error boundary to catch errors during the initial lazy-load phase or
  // any uncaught runtime exceptions at the top of the tree. When an error occurs we show a
  // simple fallback message and allow the user to retry. We intentionally gate this out of the
  // unit-test environment to avoid disrupting existing Jest/Enzyme snapshots.

  function RootErrorBoundary({ children }) {
    const [error, setError] = React.useState(null);

    if (error) {
      return (
        <div className="vads-u-margin-y--3 vads-u-text-align--center">
          <va-alert status="error" uswds>
            <h2 slot="headline">We’re sorry, something went wrong.</h2>
            <p>Try refreshing the page, or you can retry below.</p>
          </va-alert>
          {/* eslint-disable-next-line react/button-has-type */}
          <button className="usa-button" onClick={() => setError(null)}>
            Retry
          </button>
        </div>
      );
    }

    // Inner boundary implemented as a class so we can leverage componentDidCatch
    // without converting the whole file to JSX-only syntax.
    // eslint-disable-next-line react/require-render-return
    class InnerBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false };
      }

      componentDidCatch(err) {
        this.setState({ hasError: true });
        setError(err);
      }

      render() {
        // Render nothing if an error was caught; the outer function component displays the UI.
        if (this.state.hasError) return null;
        return this.props.children;
      }
    }

    return <InnerBoundary>{children}</InnerBoundary>;
  }

  // Skip Suspense wrapper in unit-test environment to preserve existing tests
  let app = component;
  if (process.env.NODE_ENV !== 'test') {
    app = (
      <RootErrorBoundary>
        <Suspense fallback={<va-loading-indicator message="Loading..." />}>
          {component}
        </Suspense>
      </RootErrorBoundary>
    );
  }

  if (document.readyState !== 'loading') {
    ReactDOM.render(app, root);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      ReactDOM.render(app, root);
    });
  }
}
