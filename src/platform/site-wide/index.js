// Node modules.
import '@department-of-veterans-affairs/formation/dist/formation';
// Relative imports.
import '../monitoring/sentry.js';
import './component-library-analytics-setup';
import './medallia-feedback-button';
import './moment-setup';
import './popups';
import './wysiwyg-analytics-setup';
import addFocusBehaviorToCrisisLineModal from './accessible-VCL-modal';
import startAnnouncementWidget from './announcements';
import startBanners from './banners';
import startPromoBanners from './promoBanners';
import startHeader from './header';
import startMegaMenuWidget from './mega-menu';
import startMobileMenuButton from './mobile-menu-button';
import startSideNav from './side-nav';
import startUserNavWidget from './user-nav';
import startVAFooter from './va-footer';
import { addOverlayTriggers } from './legacy/menu';

/**
 * Start up the site-wide components that live on every page, like
 * the login widget, the header menus, and the feedback widget.
 *
 * @param {Store} commonStore The Redux store being used by this application
 */
export default function startSitewideComponents(commonStore) {
  // New navigation menu
  if (document.querySelector('#vetnav')) {
    require('./legacy/mega-menu.js');
  }

  // Prevent some browsers from changing the value when scrolling while hovering
  //  over an input[type="number"] with focus.
  document.addEventListener('wheel', event => {
    if (
      event.target.type === 'number' &&
      document.activeElement === event.target
    ) {
      event.preventDefault();
      document.body.scrollTop += event.deltaY; // Chrome, Safari, et al
      document.documentElement.scrollTop += event.deltaY; // Firefox, IE, maybe more
    }
  });

  // Start site-wide widgets.
  startUserNavWidget(commonStore);
  startAnnouncementWidget(commonStore);
  startMegaMenuWidget(window.VetsGov.headerFooter.megaMenuData, commonStore);
  startSideNav(window.sideNav, commonStore);
  startBanners();
  startPromoBanners();
  startMobileMenuButton(commonStore);
  // async IIFE so that modal initialized after widget loads
  (async () => {
    await startVAFooter(window.VetsGov.headerFooter.footerData, commonStore);
    // Start Veteran Crisis Line modal functionality.
    addFocusBehaviorToCrisisLineModal();
    addOverlayTriggers();
  })();
  startHeader(commonStore, window.VetsGov.headerFooter.megaMenuData);
}
