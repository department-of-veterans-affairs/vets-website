import '../../platform/polyfills';
import createCommonStore from '../../platform/startup/store';

import headerPartial from './partials/header';
import footerPartial from './partials/footer';

import { initBanner } from '../../platform/site-wide/usa-banner-toggle';

import startUserNavWidget from '../../platform/site-wide/user-nav';
import addMenuListeners from '../../platform/site-wide/accessible-menus';
import startMegaMenuWidget from '../../platform/site-wide/mega-menu';
import startMobileMenuButton from '../../platform/site-wide/mobile-menu-button';

// import startLRNHealthCarWidget from '../../platform/site-wide/left-rail-navs/health-care';
import startFeedbackWidget from '../../platform/site-wide/feedback';
// import startAnnouncementWidget from '../../platform/site-wide/announcements';
import startVAFooter from '../../platform/site-wide/va-footer';
import redirectIfNecessary from './redirects';

redirectIfNecessary(window);

// Find native header, footer, etc based on page path
const DEPRECATED_SELECTOR_CONFIG = [
  {
    path: /.*/,
    selector:
      'header.row.main-header-wrap, div#top-nav-wrapper, div#main-header, div#footer-effect',
  },
];

let deprecatedSelector;
for (const config of DEPRECATED_SELECTOR_CONFIG) {
  if (document.location.pathname.match(config.path) !== null) {
    deprecatedSelector = config.selector;
    break;
  }
}

// Hide native elements when they're added to the DOM
function mutationObserved(mutations) {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'BODY') {
          node.classList.add('merger');
        } else if (node.matches(deprecatedSelector)) {
          node.classList.add('brand-consolidation-deprecated');
        }
      }
    });
  });
}

const observer = new MutationObserver(mutationObserved);
observer.observe(document, {
  attributes: true,
  childList: true,
  subtree: true,
});

// Set up elements for the new header and footer
const headerContainer = document.createElement('div');
headerContainer.innerHTML = headerPartial;
headerContainer.classList.add('consolidated');

const footerContainer = document.createElement('div');
footerContainer.innerHTML = footerPartial;
footerContainer.classList.add('consolidated');

document.addEventListener('DOMContentLoaded', _e => {
  observer.disconnect();
  document.body.insertBefore(headerContainer, document.body.firstChild);
  document.body.appendChild(footerContainer);
});

// Mount react components
const commonStore = createCommonStore();
document.addEventListener('DOMContentLoaded', _e => {
  if (document.querySelector('#vetnav-menu') !== null) {
    addMenuListeners(document.querySelector('#vetnav-menu'), true);
  }

  // New navigation menu
  if (document.querySelector('#vetnav')) {
    require('../../platform/site-wide/legacy/mega-menu.js');
  }

  // set up sizes for rem
  document.documentElement.style.fontSize = '10px';
  document.getElementsByTagName('body')[0].style.fontSize = '12px';

  // init toggleBanner
  initBanner();

  startUserNavWidget(commonStore);
  startMegaMenuWidget(commonStore);
  startMobileMenuButton(commonStore);
  // startLRNHealthCarWidget(commonStore);
  startFeedbackWidget(commonStore);
  // startAnnouncementWidget(commonStore);
  startVAFooter(commonStore);
});
