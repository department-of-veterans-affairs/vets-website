/** @typedef {import('../../../types/common.d').GenesysConfig} GenesysConfig */

const DEPLOYMENT_MODE_KEY = 'va-chatbot-deployment-mode';

/**
 * Genesys Cloud Headless Messenger SDK deployment configuration.
 *
 * deploymentId and region must match the values provisioned in Genesys Cloud
 * for the VA.gov virtual agent. Replace placeholder values before connecting
 * to a live environment.
 *
 * @type {GenesysConfig}
 */
export const GENESYS_CONFIG = {
  headlessDeploymentId: 'e4abdd43-d57a-4eaa-ab1c-b7f20bafc9c7',
  widgetDeploymentId: 'b691fb78-8f63-4bb9-b691-8a75c8ce1e2f',
  region: 'fedramp-use2-core',
};

/**
 * Get the current deployment mode from localStorage.
 * Defaults to 'widget' if not set or if localStorage is unavailable.
 * @returns {'widget' | 'headless'} The deployment mode
 */
export const getDeploymentMode = () => {
  try {
    return localStorage.getItem(DEPLOYMENT_MODE_KEY) || 'widget';
  } catch (e) {
    return 'widget'; // Default to widget mode if localStorage is unavailable
  }
};

/**
 * Set the deployment mode in localStorage.
 * @param {'widget' | 'headless'} mode - The deployment mode to set
 */
export const setDeploymentMode = mode => {
  try {
    localStorage.setItem(DEPLOYMENT_MODE_KEY, mode);
  } catch (e) {
    // Silent fail if localStorage is unavailable
  }
};

/**
 * Get the active deployment ID based on localStorage setting.
 * @returns {string} The deployment ID to use
 */
export const getActiveDeploymentId = () => {
  const mode = getDeploymentMode();
  return mode === 'widget'
    ? GENESYS_CONFIG.widgetDeploymentId
    : GENESYS_CONFIG.headlessDeploymentId;
};
