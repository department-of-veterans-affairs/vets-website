import cookie from 'cookie';

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

funciton startHeaderMutationObserver() {
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
  const environment =
    new URLSearchParams(window.location.search).get('hfbuild') || 'vagovprod';
  if (environment === 'localhost') {
    return 'http://localhost:3001';
  }
  return BUCKETS[environment] || '';
}

function injectHeaderFooterJS(hostname) {
  const headerFooterJS = document.createElement('script');
  headerFooterJS.setAttribute('type', 'text/javascript');
  headerFooterJS.setAttribute(
    'src',
    `${hostname}/generated/proxy-rewrite.entry.js`,
  );
  document.head.appendChild(headerFooterJS);
}

if (
  shouldActivateInjectedAssets(
    getMatchedWhitelistItem(),
    getProxyRewriteCookieValue(),
  )
) {
  redirectIfNecessary(window);

  const hostname = getHostname();
  injectHeaderFooterJS(hostname);


  // activateInjectedAssets();
}

// window.onload = () => document.body.appendChild(fileref);
