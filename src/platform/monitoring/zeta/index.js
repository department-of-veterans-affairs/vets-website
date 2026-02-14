/**
 * Zeta Global CDP SDK loader.
 *
 * Loads the Zeta Zync container tag and p13n.js SDK asynchronously.
 * Skips initialization on localhost and in test environments.
 *
 * @module platform/monitoring/zeta
 * @see https://knowledgebase.zetaglobal.com/gswz/tag-implementation
 */
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import zetaConfig from './config';

let initialized = false;

/**
 * Determines whether the Zeta SDK can be initialized in the current
 * environment. Returns false on localhost and in Mocha/Cypress test runners.
 */
export const canInitZeta = (
  env = environment,
  win = window,
) => !env?.isLocalhost() && !win?.Mocha && !win?.Cypress;

/**
 * Injects the Zeta Zync container tag script into the document.
 * The tag collects behavioral signals and establishes the Zync_ID cookie
 * for identity resolution.
 */
const loadZyncTag = () => {
  const { clientHash, partnerHash, tagName, siteId, syncUrl } = zetaConfig;
  const script = document.createElement('script');
  script.async = true;
  script.src = `${syncUrl}?c=${clientHash}&p=${partnerHash}&k=${tagName}&zmpID=${siteId}`;
  document.body.appendChild(script);
};

/**
 * Initializes the Zeta Global CDP integration.
 *
 * - Loads the Zync container tag for cookie-based identity resolution.
 * - Guards against double-initialization and non-production environments.
 */
export const initializeZeta = (checkInit = canInitZeta) => {
  if (initialized || !checkInit()) {
    return;
  }

  initialized = true;
  loadZyncTag();
};

/**
 * Resets the initialization state. Exposed only for testing.
 */
export const resetZetaInit = () => {
  initialized = false;
};
