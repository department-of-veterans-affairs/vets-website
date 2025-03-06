/**
 * All possible values for the environment name, also known as the build-type.
 * @module site/constants/environments
 */
const ENVIRONMENTS = require('./environments');

let isNode = false;

if (typeof window === 'undefined') {
  isNode = true;
}

module.exports = {
  [ENVIRONMENTS.VAGOVPROD]: {
    BUILDTYPE: ENVIRONMENTS.VAGOVPROD,
    BASE_URL: 'https://www.va.gov',
    API_URL: 'https://api.va.gov',
    DATADOG_TAGS: 'env:prod,team:virtual-agent-platform',
    DD_HOST_NAME: 'dev-vets-website',
  },

  [ENVIRONMENTS.VAGOVSTAGING]: {
    BUILDTYPE: ENVIRONMENTS.VAGOVSTAGING,
    BASE_URL: 'https://staging.va.gov',
    API_URL: 'https://staging-api.va.gov',
    DATADOG_TAGS: 'env:staging,team:virtual-agent-platform',
    DD_HOST_NAME: 'staging-vets-website',
  },

  [ENVIRONMENTS.VAGOVDEV]: {
    BUILDTYPE: ENVIRONMENTS.VAGOVDEV,
    BASE_URL: 'https://dev.va.gov',
    API_URL: 'https://dev-api.va.gov',
    DATADOG_TAGS: 'env:dev,team:virtual-agent-platform',
    DD_HOST_NAME: 'prod-vets-website',
  },

  [ENVIRONMENTS.LOCALHOST]: {
    BUILDTYPE: ENVIRONMENTS.LOCALHOST,
    BASE_URL: isNode
      ? 'https://localhost:3001'
      : `http://${location.hostname || 'localhost'}:${
          location.port ? location.port : '3001'
        }`,
    API_URL: isNode
      ? `http://${process.env.API_HOST}:3000`
      : `http://${location.hostname || 'localhost'}:3000`,
  },
};
