/**
 * Module for site wide components
 * @module platform/site-wide
 */
import '../monitoring/sentry.js';
import './medallia-feedback-button';
import './moment-setup';
import './popups';
import './wysiwyg-analytics-setup';
import './component-library-analytics-setup';
import startAnnouncementWidget from './announcements';
import startBanners from './banners';
import startHeaderWidget from './header';
import startSideNav from './side-nav';
import startVAFooter from './va-footer';

import '@department-of-veterans-affairs/formation/dist/formation';
import 'platform/site-wide/user-nav/sass/user-nav.scss';

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
  startHeaderWidget(commonStore, window.VetsGov.headerFooter.megaMenuData);
  startAnnouncementWidget(commonStore);
  startSideNav(window.sideNav, commonStore);
  startBanners();
  startVAFooter(window.VetsGov.headerFooter.footerData, commonStore);
}
