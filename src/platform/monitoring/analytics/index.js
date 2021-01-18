import * as Sentry from '@sentry/browser';

import addButtonLinkListeners from './addButtonLinkListeners';

function attachAnalytics() {
  try {
    // Global site-wide listeners
    addButtonLinkListeners();
  } catch (error) {
    Sentry.withScope(scope => {
      scope.setExtra('error', error);
      Sentry.captureMessage(
        'Error attaching site-wide event listeners used for analytics',
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
