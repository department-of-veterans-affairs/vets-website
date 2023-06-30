// Node modules.
import 'platform/polyfills';
import cookie from 'cookie';
// Relative imports.
import addFocusBehaviorToCrisisLineModal from 'platform/site-wide/accessible-VCL-modal';
import bucketsContent from 'site/constants/buckets-content';
import createCommonStore from 'platform/startup/store';
import environment from 'platform/utilities/environment';
import environments from 'site/constants/environments';
import startHeader from 'platform/site-wide/header';
import startMegaMenuWidget from 'platform/site-wide/mega-menu';
import startMobileMenuButton from 'platform/site-wide/mobile-menu-button';
import startUserNavWidget from 'platform/site-wide/user-nav';
import startVAFooter, { footerElemementId } from 'platform/site-wide/va-footer';
import { addOverlayTriggers } from 'platform/site-wide/legacy/menu';
import { getAssetPath } from '~/platform/site-wide/helpers/team-sites/get-asset-path';
import { getTargetEnv } from '~/platform/site-wide/helpers/team-sites/get-target-env';
import redirectIfNecessary from './redirects';
import headerPartial from './partials/header';
import footerPartial from './partials/footer';
import proxyWhitelist from './proxy-rewrite-whitelist.json';

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

function activateHeaderFooter() {
  // Set up elements for the new header and footer
  const headerContainer = document.createElement('div');
  const skipLink = document.getElementById('skiplink');
  headerContainer.innerHTML = headerPartial;
  headerContainer.classList.add('consolidated');

  const footerContainer = document.createElement('div');
  footerContainer.innerHTML = footerPartial;
  footerContainer.classList.add('consolidated');

  if (skipLink) {
    skipLink.after(headerContainer);
  } else if (document.body.firstChild) {
    document.body.firstChild.before(headerContainer);
  }
  document.body.appendChild(footerContainer);
}

function renderFooter(data, commonStore) {
  const subFooter = document.querySelectorAll('#sub-footer .small-print');
  const lastUpdated = subFooter && subFooter.item(0).textContent;

  startVAFooter(data, commonStore, () => {
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

  // New navigation menu
  if (document.querySelector('#vetnav')) {
    require('../../platform/site-wide/legacy/mega-menu');
  }

  // set up sizes for rem
  document.documentElement.style.fontSize = '10px';
  document.getElementsByTagName('body')[0].style.fontSize = '12px';

  // Start site-wide widgets.
  startUserNavWidget(commonStore);
  startMegaMenuWidget(headerFooterData.megaMenuData, commonStore);
  startMobileMenuButton(commonStore);
  renderFooter(headerFooterData.footerData, commonStore);
  startHeader(commonStore, headerFooterData.megaMenuData);

  // Start Veteran Crisis Line modal functionality.
  addFocusBehaviorToCrisisLineModal();
  addOverlayTriggers();
}

function getContentHostName() {
  if (environment.BUILDTYPE === environments.LOCALHOST) {
    return environment.BASE_URL;
  }

  return bucketsContent[environment.BUILDTYPE];
}

// TO DO remove on clean up
// function getAssetHostName() {
//   if (environment.BUILDTYPE === environments.LOCALHOST) {
//     return environment.BASE_URL;
//   }

//   return buckets[environment.BUILDTYPE];
// }

function removeCurrentHeaderFooter() {
  const observer = new MutationObserver(createMutationObserverCallback());
  observer.observe(document, {
    attributes: true,
    childList: true,
    subtree: true,
  });

  document.addEventListener('DOMContentLoaded', _e => {
    observer.disconnect();
  });
}

function activateInjectedAssets() {
  activateHeaderFooter();
  fetch(`${getContentHostName()}/generated/headerFooter.json`)
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
}

function getProxyRewriteCookieValue(
  cookies = document.cookie,
  parseCookie = cookie.parse,
) {
  return parseCookie(cookies).proxyRewrite;
}

function getMatchedWhitelistItem(
  whitelist = proxyWhitelist.proxyRewriteWhitelist,
) {
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

const scriptPaths = [
  '/generated/polyfills.entry.js',
  '/generated/vendor.entry.js',
  '/generated/proxy-rewrite.entry.js',
];

const linkPaths = ['/generated/styleConsolidated.css'];

function removeInjectedHeaderFooter(docHead = document.head) {
  Array.from(
    document.querySelectorAll(
      'script[src*="va-gov-assets"],link[href*="va-gov-assets"]',
    ),
  ).forEach(node => docHead.removeChild(node));
}

function addOverrideHeaderFooter(
  hostname,
  links = linkPaths,
  scripts = scriptPaths,
  docHead = document.head,
) {
  const docFragment = document.createDocumentFragment();
  // add <script>s
  scripts.forEach(path => {
    const scriptNode = document.createElement('script');
    scriptNode.setAttribute('src', `${hostname}${path}`);

    docFragment.appendChild(scriptNode);
  });

  // add <link>
  links.forEach(path => {
    const linkNode = document.createElement('link');
    linkNode.setAttribute('rel', 'stylesheet');
    linkNode.setAttribute('href', `${hostname}${path}`);

    docFragment.appendChild(linkNode);
  });

  docHead.appendChild(docFragment);
}

function main() {
  // if a build type is passed in the url, then the header for the specific build type is used
  const targetEnvironment = getTargetEnv();
  // Get the AWS S3 Bucket asset-path for the given environment.
  const assetPath = getAssetPath(targetEnvironment);

  if (targetEnvironment && targetEnvironment !== environment.BUILDTYPE) {
    removeCurrentHeaderFooter();
    removeInjectedHeaderFooter();
    addOverrideHeaderFooter(assetPath);
  } else if (
    shouldActivateInjectedAssets(
      getMatchedWhitelistItem(),
      getProxyRewriteCookieValue(),
    )
  ) {
    redirectIfNecessary(window);
    removeCurrentHeaderFooter();

    if (
      document.readyState === 'complete' ||
      document.readyState === 'loaded' ||
      document.readyState === 'interactive'
    ) {
      activateInjectedAssets();
    } else {
      document.addEventListener('DOMContentLoaded', activateInjectedAssets);
    }
  }
}

main();
