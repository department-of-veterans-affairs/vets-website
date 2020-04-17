import addJumplinkListeners from './addJumpLinkListeners';
import addQaSectionListeners from './addQaSectionListeners';
import addTeaserListeners from './addTeaserListeners';
import addHomepageBannerListeners from './addHomepageBannerListeners';

const pageListenersMap = new Map();

/**
 * Use pageListenersMap.set(<page path>, <array of functions>) to register
 * listeners onto certain pages. If global, just execute the listener directly.
 */

pageListenersMap.set('/coronavirus-veteran-frequently-asked-questions/', [
  addJumplinkListeners,
  addQaSectionListeners,
]);

pageListenersMap.set('/', [addHomepageBannerListeners]);

const specialListeners = pageListenersMap.get(document.location.pathname);

if (specialListeners) {
  specialListeners.forEach(f => f());
}

// Global listeners
addTeaserListeners();

// Prevent the window from navigating away.
// Useful to verify analytics when links are clicked.
// window.onbeforeunload = function() {
//   return ''
// }
