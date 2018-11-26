const ENVIRONMENTS = require('../../../site/constants/environments');

const RESERVED_E2E_PORT = process.env.WEB_PORT || 3333;
const E2E_API_PORT = process.env.API_PORT;

const ENVIRONMENT_CONFIGURATIONS = {
  [ENVIRONMENTS.VAGOVPROD]: {
    API_URL: 'https://api.va.gov',
    BASE_URL: 'https://www.va.gov',
  },

  [ENVIRONMENTS.VAGOVSTAGING]: {
    API_URL: 'https://staging-api.va.gov',
    BASE_URL: 'https://staging.va.gov',
  },

  [ENVIRONMENTS.VAGOVDEV]: {
    API_URL: 'https://dev-api.va.gov',
    BASE_URL: 'https://dev.va.gov',
  },

  [ENVIRONMENTS.LOCALHOST]: {
    API_URL: `http://${location.hostname}:3000`,
    BASE_URL: `http://${location.hostname}:3001`,
  },
};

const currentEnvironment = process.env.BUILDTYPE;
const currentEnvironmentConfig = ENVIRONMENT_CONFIGURATIONS[currentEnvironment];

if (location.port === RESERVED_E2E_PORT) {
  // E2E tests are an edge case - they test a certain build-type,
  // but execute under the localhost hostname.

  const e2eConfig = {
    API_URL: `http://localhost:${E2E_API_PORT}`,
    BASE_URL: `http://localhost:${RESERVED_E2E_PORT}`,
  };

  Object.assign(currentEnvironmentConfig, e2eConfig);
}

module.exports = {
  ...currentEnvironmentConfig,
  isProduction: () => currentEnvironment === ENVIRONMENTS.VAGOVPROD,
  isStaging: () => currentEnvironment === ENVIRONMENTS.VAGOVSTAGING,
  isDev: () => currentEnvironment === ENVIRONMENTS.VAGOVDEV,
  isLocal: () => currentEnvironment === ENVIRONMENTS.LOCALHOST,
};
