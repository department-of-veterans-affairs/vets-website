// This will move later, mostly likely
import '../../js/common/sentry.js';

import '../../js/legacy/menu';  // Used in the footer.
import '../../js/common/usa-banner-toggle';
import '../../js/common/utils/accessible-VCL-modal';
import addMenuListeners from '../../js/common/utils/accessible-menus';
import createLoginWidget from '../../js/login/login-entry';
import createFeedbackWidget from '../../js/feedback/feedback-entry';

export default function startSitewideComponents(commonStore) {
  addMenuListeners(document.querySelector('#vetnav-menu'), true);

  // New navigation menu
  if (document.querySelector('#vetnav')) {
    require('../../js/legacy/mega-menu.js');
  }

  // Prevent some browsers from changing the value when scrolling while hovering
  //  over an input[type="number"] with focus.
  document.addEventListener('wheel', (event) => {
    if (event.target.type === 'number' && document.activeElement === event.target) {
      event.preventDefault();
      document.body.scrollTop += event.deltaY; // Chrome, Safari, et al
      document.documentElement.scrollTop += event.deltaY; // Firefox, IE, maybe more
    }
  });

  createLoginWidget(commonStore);
  createFeedbackWidget(commonStore);
}
