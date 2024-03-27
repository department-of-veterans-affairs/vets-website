// eslint-disable no-param-reassign
import 'platform/polyfills';
import React from 'react';
import { Provider } from 'react-redux';
import cookie from 'cookie';
import { debounce } from 'lodash';
import bucketsContent from 'site/constants/buckets-content';
import environments from 'site/constants/environments';
import environment from 'platform/utilities/environment';
import createCommonStore from 'platform/startup/store';
import startReactApp from 'platform/startup/react';
import addFocusBehaviorToCrisisLineModal from './utilities/accessible-VCL-modal';
import { getAssetPath } from './utilities/get-asset-path';
import { getTargetEnv } from './utilities/get-target-env';
import redirectIfNecessary from './redirects';
import { getDesktopHeaderHtml } from './partials/desktop/header';
import { getMobileHeaderHtml } from './partials/mobile/header';
import { getDesktopFooterHtml } from './partials/desktop/footer';
import { getMobileFooterHtml } from './partials/mobile/footer';
import proxyWhitelist from './proxy-rewrite-whitelist.json';
import {
  addHeaderEventListeners,
  addOverlayTriggers,
} from './utilities/menu-behavior';
import Search from './partials/search';

const store = createCommonStore();

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
        const addedNode = node;

        if (node.nodeType === Node.ELEMENT_NODE) {
          if (addedNode.tagName === 'BODY') {
            addedNode.classList.add('merger');
            addedNode.style.fontSize = '12px';
          } else if (addedNode.matches(deprecatedSelector)) {
            addedNode.classList.add('brand-consolidation-deprecated');
          }
        }
      });
    });
  };
}

function renderHeader(megaMenuData, headerContainer = null) {
  const container =
    headerContainer || document.querySelector('.ts-header-container');
  const skipLink = document.getElementById('skiplink');
  const isMobile = window.innerWidth < 768;

  if (container) {
    if (isMobile) {
      container.innerHTML = getMobileHeaderHtml(megaMenuData);
    } else {
      container.innerHTML = getDesktopHeaderHtml(megaMenuData);
    }

    if (skipLink) {
      skipLink.after(container);
    } else if (document.body.firstChild) {
      document.body.firstChild.before(container);
    }
  }

  addHeaderEventListeners();

  const parentElement = isMobile
    ? 'mobile-search-container'
    : 'search-dropdown';

  startReactApp(
    <Provider store={store}>
      <Search isMobile={isMobile} />
    </Provider>,
    document.getElementById(parentElement),
  );

  return null;
}

function renderFooter(footerData, footerContainer = null) {
  const container =
    footerContainer || document.querySelector('.ts-footer-container');
  const subFooter = document.querySelectorAll('#sub-footer .small-print');
  const lastUpdated = (subFooter && subFooter.item(0).textContent) || null;

  const footer =
    window.innerWidth < 768
      ? getMobileFooterHtml(footerData)
      : getDesktopFooterHtml(footerData);

  if (lastUpdated) {
    const lastUpdatedDate = lastUpdated.replace('Last updated ', '');

    container.innerHTML = `
      <div>
        <div class="footer-lastupdated">
          <div class="usa-grid">
            <div class="col-md-3"></div>
            <div class="col-md-9">
              Last updated: ${lastUpdatedDate}
            </div>
          </div>
        </div>
      </div>
      ${footer}
    `;
  } else {
    container.innerHTML = footer;
  }

  document.body.appendChild(container);
}

function addFonts() {
  const fonts = [
    'sourcesanspro-bold-webfont.woff2',
    'sourcesanspro-regular-webfont.woff2',
    'bitter-bold.woff2',
    'fa-solid-900.woff2',
  ];

  fonts.forEach(font => {
    const link = document.createElement('link');
    link.type = 'font/woff2';
    link.rel = 'preload';
    link.href = `https://prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com/generated/${font}`;
    link.as = 'font';
    link.crossOrigin = true;

    document.head.appendChild(link);
  });
}

function teamsitesSetup() {
  // set up sizes for rem
  document.getElementsByTagName('html')[0].style.fontSize = '10px';
  document.getElementsByTagName('body')[0].style.fontSize = '12px';

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
      teamsitesSetup();

      const headerContainer = document.createElement('div');
      headerContainer.classList.add('ts-header-container');

      const footerContainer = document.createElement('div');
      footerContainer.classList.add('ts-footer-container');

      renderHeader(headerFooterData.megaMenuData, headerContainer);
      renderFooter(headerFooterData.footerData, footerContainer);

      window.addEventListener(
        'resize',
        debounce(() => renderHeader(headerFooterData.megaMenuData), 200),
      );
      window.addEventListener(
        'resize',
        debounce(() => renderFooter(headerFooterData.footerData), 200),
      );
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

const linkPaths = ['/generated/styleConsolidated.css', './sass/newStyles.scss'];

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
    addFonts();

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
