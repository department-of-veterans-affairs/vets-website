const _Environments = {
  production: {
    API_URL: 'https://api.vets.gov',
    BASE_URL: 'https://www.vets.gov',
  },
  staging: {
    API_URL: 'https://staging-api.vets.gov',
    BASE_URL: 'https://staging.vets.gov',
  },
  preview: {
    API_URL: 'https://api.va.gov',
    BASE_URL: 'https://preview.va.gov',
  },
  vagovstaging: {
    API_URL: 'https://staging-api.va.gov',
    BASE_URL: 'https://staging.va.gov',
  },
  vagovdev: {
    API_URL: 'https://dev-api.va.gov',
    BASE_URL: 'https://dev.va.gov',
  },
  development: {
    API_URL: process.env.API_URL || 'https://dev-api.vets.gov',
    BASE_URL: process.env.BASE_URL || 'https://dev.vets.gov',
  },
  local: {
    API_URL: `http://${location.hostname}:3000`,
    BASE_URL: `http://${location.hostname}:3001`,
  },
  e2e: {
    API_URL: `http://localhost:${process.env.API_PORT || 3000}`,
    BASE_URL: `http://localhost:${process.env.WEB_PORT || 3333}`,
  },
};

function getEnvironment() {
  let platform;

  if (location.port === '3001') {
    platform = 'local';
  } else if (location.port === `${process.env.WEB_PORT || 3333}`) {
    platform = 'e2e';
  } else {
    platform = __BUILDTYPE__;
  }

  return _Environments[platform];
}

const environment = getEnvironment();
module.exports = environment;
