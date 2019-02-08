import cookie from 'cookie';
import _ from 'lodash';

import redirectIfNecessary from '../redirects';
import { proxyRewriteWhitelist } from './proxy-rewrite-whitelist.json';
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

function startHeaderMutationObserver() {
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

function getHostname() {
  // default to vagovprod
  const environment =
    new URLSearchParams(window.location.search).get('hfbuild') || 'vagovprod';

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
  '/generated/proxy-rewrite.entry.js',
];

function createHeaderFooterJSNodes(hostname, filePaths = jsFilePaths) {
  return filePaths.map(path => {
    const scriptNode = document.createElement('script');
    scriptNode.setAttribute('type', 'text/javascript');
    scriptNode.setAttribute('src', `${hostname}${path}`);

    return scriptNode;
  });
}

function createHeaderFooterCSSNodes(hostname) {
  const styles = [];
  const hideDeprecatedStyle = document.createElement('style');
  hideDeprecatedStyle.setAttribute('type', 'text/css');
  hideDeprecatedStyle.appendChild(
    document.createTextNode(
      '.brand-consolidation-deprecated { display: none !important; } ',
    ),
  );
  styles.push(hideDeprecatedStyle);

  const headerFooterCSS = document.createElement('link');
  headerFooterCSS.setAttribute('rel', 'stylesheet');
  headerFooterCSS.setAttribute(
    'href',
    `${hostname}/generated/styleConsolidated.css`,
  );

  styles.push(headerFooterCSS);

  return styles;
}

function docFragmentFromArray(nodes) {
  const docFragment = document.createDocumentFragment();
  nodes.forEach(node => docFragment.appendChild(node));
  return docFragment;
}

function main() {
  if (
    shouldActivateInjectedAssets(
      getMatchedWhitelistItem(),
      getProxyRewriteCookieValue(),
    )
  ) {
    redirectIfNecessary(window);

    // removes the old header
    startHeaderMutationObserver();

    const hostname = getHostname();
    const docFragment = docFragmentFromArray([
      ...createHeaderFooterCSSNodes(hostname),
      ...createHeaderFooterJSNodes(hostname),
    ]);

    document.head.appendChild(docFragment);
  }
}
main();
