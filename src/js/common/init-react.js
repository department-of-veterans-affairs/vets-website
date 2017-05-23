// Exports a function for initialize a React app.

/**
 * Initializes react for the page. This should be the first Javascript call.
 *
 * @callback onDOMContentLoaded Called on the DOMContentLoaded event.
 */
export default function initReact(onDOMContentLoaded) {
  // Detect if this is a child frame. If yes, initialize the react devtools hook to work around
  //   https://github.com/facebook/react-devtools/issues/57
  // This must occur before any react code is loaded.
  if (window.parent !== window) {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  }

  // Create a Vets.gov global that all code can use. This is mostly useful for overrides for
  // think like api URL endpoints during testing.
  window.VetsGov = window.VetsGov || {
    api: {
      url: '',  // API server. Evetually should be 'https://api.vets.gov' in production.
    },
    scroll: { // Default scroll settings.  These are overridden by our E2E tests.
      duration: 500,
      delay: 0,
      smooth: true
    }
  };

  // eslint-disable-next-line scanjs-rules/call_addEventListener
  document.addEventListener('DOMContentLoaded', () => {
    onDOMContentLoaded();
  });
}
