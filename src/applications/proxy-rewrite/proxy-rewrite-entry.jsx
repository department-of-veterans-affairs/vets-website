import '../../platform/polyfills';
import cookie from 'cookie';

import buckets from '../../site/constants/buckets';
import environments from '../../site/constants/environments';

import createCommonStore from '../../platform/startup/store';
import environment from '../../platform/utilities/environment';

import headerPartial from './partials/header';
import footerPartial from './partials/footer';

import startUserNavWidget from '../../platform/site-wide/user-nav';
import addMenuListeners from '../../platform/site-wide/accessible-menus';
import startMegaMenuWidget from '../../platform/site-wide/mega-menu';
import startMobileMenuButton from '../../platform/site-wide/mobile-menu-button';

// import startLRNHealthCarWidget from '../../platform/site-wide/left-rail-navs/health-care';
import startFeedbackWidget from '../../platform/site-wide/feedback';
// import startAnnouncementWidget from '../../platform/site-wide/announcements';
import startVAFooter, {
  footerElemementId,
} from '../../platform/site-wide/va-footer';
import redirectIfNecessary from './redirects';
import addFocusBehaviorToCrisisLineModal from '../../platform/site-wide/accessible-VCL-modal';
import { addOverlayTriggers } from '../../platform/site-wide/legacy/menu';
import { proxyRewriteWhitelist } from './proxy-rewrite-whitelist.json';

function createMutationObserverCallback() {
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
  return function mutationObserved(mutations) {
    mutations.forEach(mutation => {
      Array.from(mutation.addedNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'BODY') {
            node.classList.add('merger');
          } else if (node.matches(deprecatedSelector)) {
            node.classList.add('brand-consolidation-deprecated');
          }
        }
      });
    });
  };
}

function activateHeaderFooter(observer) {
  // Set up elements for the new header and footer
  const headerContainer = document.createElement('div');
  headerContainer.innerHTML = headerPartial;
  headerContainer.classList.add('consolidated');

  const footerContainer = document.createElement('div');
  footerContainer.innerHTML = footerPartial;
  footerContainer.classList.add('consolidated');

  observer.disconnect();
  document.body.insertBefore(headerContainer, document.body.firstChild);
  document.body.appendChild(footerContainer);
}

function renderFooter(data) {
  const subFooter = document.querySelectorAll('#sub-footer .small-print');
  const lastUpdated = subFooter && subFooter.item(0).textContent;

  startVAFooter(data, () => {
    addOverlayTriggers();
    addFocusBehaviorToCrisisLineModal();

    if (lastUpdated) {
      const lastUpdatedPanel = document.createElement('div');
      const lastUpdatedDate = lastUpdated.replace('Last updated ', '');

      lastUpdatedPanel.innerHTML = `
        <div class="footer-lastupdated">
          <div class="usa-grid">
            <div class="col-md-3"></div>
            <div class="col-md-9">
              Last updated: ${lastUpdatedDate}
            </div>
          </div>
        </div>
      `;

      const footer = document.getElementById(footerElemementId);

      footer.parentElement.insertBefore(lastUpdatedPanel, footer);
    }
  });
}

function mountReactComponents(headerFooterData, commonStore) {
  const crisisModal = document.getElementById('modal-crisisline');
  if (crisisModal) {
    crisisModal.parentNode.removeChild(crisisModal);
  }
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

  startUserNavWidget(commonStore);
  startMegaMenuWidget(headerFooterData.megaMenuData, commonStore);
  startMobileMenuButton(commonStore);
  // startLRNHealthCarWidget(commonStore);
  startFeedbackWidget(commonStore);
  // startAnnouncementWidget(commonStore);
  renderFooter(headerFooterData.footerData);
}

function getAssetHostName() {
  if (environment.BUILDTYPE === environments.LOCALHOST) {
    return environment.BASE_URL;
  }

  return buckets[environment.BUILDTYPE];
}

function activateInjectedAssets() {
  const observer = new MutationObserver(createMutationObserverCallback());
  observer.observe(document, {
    attributes: true,
    childList: true,
    subtree: true,
  });

  document.addEventListener('DOMContentLoaded', _e => {
    activateHeaderFooter(observer);
    fetch(`${getAssetHostName()}/generated/headerFooter.json`)
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        }

        throw new Error(
          `vets_headerFooter_error: Failed to fetch header and footer menu data: ${
            resp.statusText
          }`,
        );
      })
      .then(headerFooterData => {
        mountReactComponents(headerFooterData, createCommonStore());
      });
  });
}

function getProxyRewriteCookieValue(
  cookies = document.cookie,
  parseCookie = cookie.parse,
) {
  return parseCookie(cookies).proxyRewrite;
}

function getMatchedWhitelistItem(whitelist = proxyRewriteWhitelist) {
  const { hostname, pathname } = window.location;

  return whitelist.find(
    whitelistItem =>
      whitelistItem.hostname === hostname &&
      pathname.startsWith(whitelistItem.pathnameBeginning),
  );
}

function shouldActivateInjectedAssets(whitelistItem, proxyRewriteCookieValue) {
  if (whitelistItem === undefined) {
    return false;
  }

  if (whitelistItem.cookieOnly) {
    return proxyRewriteCookieValue;
  }

  return true;
}

if (
  shouldActivateInjectedAssets(
    getMatchedWhitelistItem(),
    getProxyRewriteCookieValue(),
  )
) {
  redirectIfNecessary(window);
  activateInjectedAssets();
}
