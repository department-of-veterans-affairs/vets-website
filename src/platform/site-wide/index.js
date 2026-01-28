// Relative imports.
import '../monitoring/sentry';
import '../monitoring/web-vitals';
import './component-library-analytics-setup';
import './medallia-feedback-button';
import './moment-setup';
import './popups';
import './wysiwyg-analytics-setup';
import loadAccordionHandler from './legacy-component-js/accordion';
import createAdditionalInfoWidget from './legacy-component-js/additional-info';
import addSidenavListeners from './legacy-component-js/sidenav';
import addFocusBehaviorToCrisisLineModal from './accessible-VCL-modal';
import startAnnouncementWidget from './announcements';
import startBanners from './banners';
import startHeader from './header';
import startMegaMenuWidget from './mega-menu';
import startMobileMenuButton from './mobile-menu-button';
import startSideNav from './side-nav';
import startUserNavWidget from './user-nav';
import startAuthModals from './user-nav/startAuthModals';
import startVAFooter from './va-footer';
import startTaskTabs from './task-tabs'
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
    require('./legacy/mega-menu');
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

  /**
   * Below block is needed to load the sitewide footer, since it still relies on
   * some legacy javascript. There are other instances where old usa-accordions, sidenavs, and
   * buttons that may rely on these as well.
   *
   * Once https://github.com/department-of-veterans-affairs/vets-design-system-documentation/issues/3568 is complete
   * this block can be removed
   */
  const waitForDocumentReady = () => {
    return new Promise(resolve => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', resolve);
      }
    });
  };

  waitForDocumentReady().then(() => {
    loadAccordionHandler();
    createAdditionalInfoWidget();
    addSidenavListeners();
  });

  // Start site-wide widgets.
  startUserNavWidget(commonStore);
  startAuthModals(commonStore);
  startAnnouncementWidget(commonStore);
  startMegaMenuWidget(window.VetsGov.headerFooter.megaMenuData, commonStore);
  startSideNav(window.sideNav, commonStore);
  startBanners();
  startMobileMenuButton(commonStore);
  startVAFooter(window.VetsGov.headerFooter.footerData, commonStore);
  startHeader(commonStore, window.VetsGov.headerFooter.megaMenuData);
  startTaskTabs(commonStore);

  // Start Veteran Crisis Line modal functionality.
  addFocusBehaviorToCrisisLineModal();
  addOverlayTriggers();
}
