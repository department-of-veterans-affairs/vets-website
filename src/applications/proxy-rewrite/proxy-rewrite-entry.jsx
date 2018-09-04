import '../../platform/polyfills';
import createCommonStore from '../../platform/startup/store';
import startSitewideComponents from '../../platform/site-wide';

import headerPartial from './partials/header';
import footerPartial from './partials/footer';

// Find native header, footer, etc based on page path
const DEPRECATED_SELECTOR_CONFIG = [
  { path: /\/health\/.*/, selector: 'header.row.main-header-wrap, div#footer-effect' },
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
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
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
observer.observe(document, { attributes: true, childList: true, subtree: true });

// Set up elements for the new header and footer
const headerEl = document.createElement('div');
headerEl.innerHTML = headerPartial;

const footerContainer = document.createElement('div');
footerContainer.innerHTML = footerPartial;

document.addEventListener('DOMContentLoaded', (_e) => {
  observer.disconnect();
  document.body.insertBefore(headerEl, document.body.firstChild);
  document.body.appendChild(footerContainer);
});

// Mount react components
const commonStore = createCommonStore();
document.addEventListener('DOMContentLoaded', (_e) => {
  startSitewideComponents(commonStore);
});
