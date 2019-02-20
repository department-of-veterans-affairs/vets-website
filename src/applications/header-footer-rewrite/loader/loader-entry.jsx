import cookie from 'cookie';
import _ from 'lodash';

import redirectIfNecessary from '../redirects';
import { proxyRewriteWhitelist } from './loader-whitelist.json';
import BUCKETS from '../../../site/constants/buckets';

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

function removeExistingHeader() {
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

function getHostnameOverride() {
  // default to vagovprod
  const environment = (window.location.search.match(/\bhfbuild=(\w+)/) ||
    [])[1];

  // localhost is not available in the buckets
  if (environment === 'localhost') {
    return 'http://localhost:3001';
  }

  // if the bucket is not found, an empty string will use relative paths
  return BUCKETS[environment] || '';
}

const jsFilePaths = [
  '/js/settings.js',
  '/generated/polyfills.entry.js',
  '/generated/vendor.entry.js',
  '/generated/rewriter.entry.js',
];

function addOverrideHeaderFooter(
  hostname,
  filePaths = jsFilePaths,
  docHead = document.head,
) {
  const docFragment = document.createDocumentFragment();
  // add <script>s
  filePaths.forEach(path => {
    const scriptNode = document.createElement('script');
    scriptNode.setAttribute('src', `${hostname}${path}`);

    docFragment.appendChild(scriptNode);
  });

  // add inline CSS
  const styleNode = document.createElement('style');
  styleNode.appendChild(
    document.createTextNode(
      '.brand-consolidation-deprecated { display: none !important; } ',
    ),
  );
  docFragment.appendChild(styleNode);

  // add <link>
  const linkNode = document.createElement('link');
  linkNode.setAttribute('rel', 'stylesheet');
  linkNode.setAttribute('href', `${hostname}/generated/styleConsolidated.css`);
  docFragment.appendChild(linkNode);

  docHead.appendChild(docFragment);
}

function main() {
  if (
    shouldActivateInjectedAssets(
      getMatchedWhitelistItem(),
      getProxyRewriteCookieValue(),
    )
  ) {
    redirectIfNecessary(window);
    removeExistingHeader();

    // if a build type is passed in the url, then the header for the specific build type is used
    const hostnameOverride = getHostnameOverride();

    console.log(hostnameOverride);
    if (hostnameOverride) {
      addOverrideHeaderFooter(hostnameOverride);
    }
  }
}
main();
