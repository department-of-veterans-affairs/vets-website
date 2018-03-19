// polyfills are loaded in vendor chunk
import './polyfills';
import './sentry.js';
import '../legacy/menu'; // Used in the footer.
import './usa-banner-toggle';
import './utils/accessible-VCL-modal';
import addMenuListeners from './utils/accessible-menus';
import {
  buildMobileBreadcrumb,
  toggleHiddenLinks
} from './breadcrumbs/mobile-breadcrumb';
import _ from 'lodash/fp';

addMenuListeners(document.querySelector('#vetnav-menu'), true);

// New navigation menu
if (document.querySelector('#vetnav')) {
  require('../legacy/mega-menu.js');
}

// Check for breadcrumb
window.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#va-breadcrumb')) {
    buildMobileBreadcrumb('va-breadcrumb', 'va-breadcrumb-list');
  }
});

window.addEventListener('resize', () => {
  if (document.querySelector('#va-breadcrumb')) {
    _.debounce(toggleHiddenLinks('va-breadcrumb-list'), 250);
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
