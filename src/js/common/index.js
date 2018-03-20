// polyfills are loaded in vendor chunk
import './polyfills';
import './sentry.js';
import '../legacy/menu'; // Used in the footer.
import './usa-banner-toggle';
import './utils/accessible-VCL-modal';
import addMenuListeners from './utils/accessible-menus';
import {
  buildMobileBreadcrumb,
  toggleLinks
} from './breadcrumbs/mobile-breadcrumb';
import debounce from 'lodash/debounce';

addMenuListeners(document.querySelector('#vetnav-menu'), true);

// New navigation menu
if (document.querySelector('#vetnav')) {
  require('../legacy/mega-menu.js');
}

// Check for breadcrumb on page load
window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('va-breadcrumb')) {
    buildMobileBreadcrumb('va-breadcrumb', 'va-breadcrumb-list');
  }
});

// Pause the breadcrumb swap for 500ms
window.addEventListener('resize', () => {
  const debouncedToggleLinks = debounce(() => {
    toggleLinks('va-breadcrumb-list');
  }, 500);

  if (document.getElementById('va-breadcrumb')) {
    debouncedToggleLinks();
  }
});

// Prevent some browsers from changing the value when scrolling while hovering
//  over an input[type='number'] with focus.
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
