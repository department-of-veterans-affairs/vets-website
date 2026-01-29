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
 * @param {Object|Element} [rootOrOptions] Either a DOM element or options object
 * @param {Element} [rootOrOptions.root] A DOM element to mount the react application into
 * @param {boolean} [rootOrOptions.hydrate] Whether to hydrate existing HTML (default: false)
 *
 * When called with just component and root element (legacy):
 *   startReactApp(<App />, document.getElementById('react-root'))
 *
 * When called with options object (new):
 *   startReactApp(<App />, { hydrate: true })
 *   startReactApp(<App />, { root: myElement, hydrate: true })
 */
export default function startReactApp(component, rootOrOptions) {
  // Parse arguments - support both legacy and new API
  let root;
  let options = {};

  if (rootOrOptions && typeof rootOrOptions === 'object') {
    // Check if it's a DOM element or options object
    if (rootOrOptions instanceof Element || rootOrOptions?.nodeType === 1) {
      // Legacy API: second argument is a DOM element
      root = rootOrOptions;
    } else {
      // New API: second argument is an options object
      options = rootOrOptions;
      root = options.root;
    }
  }

  // Default root to #react-root if not specified
  if (!root) {
    root = document.getElementById('react-root');
  }

  const { hydrate = false } = options;
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

  /**
   * Mount or hydrate the React application
   * Uses ReactDOM.hydrate (React 17) when hydrate flag is true and HTML exists
   * Falls back to render otherwise
   */
  const mountApp = () => {
    // Check if we should hydrate (hydrate flag + existing HTML in root)
    if (hydrate && root.hasChildNodes()) {
      // Use React 17 hydration - attaches React to existing HTML
      ReactDOM.hydrate(component, root);

      // eslint-disable-next-line no-console
      console.log('[startReactApp] Hydrated app with existing skeleton HTML');
    } else {
      // Use render (client-side only, clears and replaces content)
      ReactDOM.render(component, root);

      if (hydrate) {
        // eslint-disable-next-line no-console
        console.warn(
          '[startReactApp] Hydration requested but no HTML found in root, using render instead',
        );
      }
    }
  };

  if (document.readyState !== 'loading') {
    mountApp();
  } else {
    document.addEventListener('DOMContentLoaded', mountApp);
  }
}
