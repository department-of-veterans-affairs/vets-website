/**
 * Module for React related startup functions
 * @module platform/startup/react
 * @see module:platform/startup
 */
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

  if (document.readyState !== 'loading') {
    ReactDOM.render(component, root);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      ReactDOM.render(component, root);
    });
  }
}
