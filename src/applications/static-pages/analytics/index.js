import addJumplinkListeners from './addJumpLinkListeners';
import addQaSectionListeners from './addQaSectionListeners';
import addTeaserListeners from './addTeaserListeners';
import addHomepageBannerListeners from './addHomepageBannerListeners';

/**
 * Use pageListenersMap.set(<page path>, <array of functions>) to register
 * listeners onto certain pages. If global, just execute the listener directly.
 */

const PAGE_EVENT_LISTENERS = new Map();

PAGE_EVENT_LISTENERS.set('/coronavirus-veteran-frequently-asked-questions/', [
  addJumplinkListeners,
  addQaSectionListeners,
]);

PAGE_EVENT_LISTENERS.set('/', [addHomepageBannerListeners]);

function attachAnalytics() {
  const specialListeners = PAGE_EVENT_LISTENERS.get(document.location.pathname);

  if (specialListeners) {
    specialListeners.forEach(f => f());
  }

  // Global listeners
  addTeaserListeners();
}

// Prevent the window from navigating away.
// Useful to verify analytics when links are clicked.
// window.onbeforeunload = function() {
//   return ''
// }

document.addEventListener('DOMContentLoaded', attachAnalytics);
