import * as Sentry from '@sentry/browser';

import addJumplinkListeners from './addJumpLinkListeners';
import addQaSectionListeners from './addQaSectionListeners';
import addButtonLinkListeners from './addButtonLinkListeners';
import addActionLinkListeners from './addActionLinkListeners';

/**
 * Use pageListenersMap.set(<page path>, <array of functions>) to register
 * listeners onto certain pages. If global, just execute the listener directly.
 */

const PAGE_EVENT_LISTENERS = new Map();

PAGE_EVENT_LISTENERS.set('/coronavirus-veteran-frequently-asked-questions/', [
  addJumplinkListeners,
  addQaSectionListeners,
]);

PAGE_EVENT_LISTENERS.set(
  '/coronavirus-veteran-frequently-asked-questions-esp/',
  [addJumplinkListeners, addQaSectionListeners],
);

PAGE_EVENT_LISTENERS.set(
  '/coronavirus-veteran-frequently-asked-questions-tag/',
  [addJumplinkListeners, addQaSectionListeners],
);

function attachAnalytics() {
  try {
    const specialListeners = PAGE_EVENT_LISTENERS.get(
      document.location.pathname,
    );

    if (specialListeners) {
      specialListeners.forEach(f => f());
    }

    // Global listeners
    addButtonLinkListeners();
    addActionLinkListeners();
  } catch (error) {
    Sentry.withScope(scope => {
      scope.setExtra('error', error);
      Sentry.captureMessage(
        'Error attaching event listeners used for analytics',
      );
    });
  }
}

// Prevent the window from navigating away.
// Useful to verify analytics when links are clicked.
// window.onbeforeunload = function() {
//   return ''
// }

document.addEventListener('DOMContentLoaded', attachAnalytics);
