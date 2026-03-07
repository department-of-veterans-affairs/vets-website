/** @typedef {import('../../../types/common.d').GenesysConfig} GenesysConfig */

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
  deploymentId: 'e4abdd43-d57a-4eaa-ab1c-b7f20bafc9c7',
  region: 'fedramp-use2-core',
};
