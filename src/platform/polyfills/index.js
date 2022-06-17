/**
 * Polyfills used by all applications
 * @name platform/polyfills
 */

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import './download-attribute';
import './canvas-toBlob';

// Edge 14's fetch implementation throws TypeMismatchErrors seemingly without
// reason. This is fixed in fetch 15, but we should use the (xhr based) polyfill
// for 14.
// https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8546263/
if (navigator.userAgent.includes('Edge/14')) {
  window.fetch = undefined;
}

// This CustomEvent polyfill is for IE11:
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#polyfill
(function() {
  if (typeof window.CustomEvent === 'function') return;

  function CustomEvent(event, params) {
    const customParams = params || {
      bubbles: false,
      cancelable: false,
      detail: null,
    };
    const evt = document?.createEvent('CustomEvent');
    evt.initCustomEvent(
      event,
      customParams.bubbles,
      customParams.cancelable,
      customParams.detail,
    );
    return evt;
  }

  window.CustomEvent = CustomEvent;
})();

// This needs to stay as require because import causes it to be executed before the
// above code
require('whatwg-fetch');
