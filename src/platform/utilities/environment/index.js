const _Environments = {
  preview: {
    API_URL: 'https://api.va.gov',
    BASE_URL: 'https://preview.va.gov',
  },
  vagovprod: {
    API_URL: 'https://api.va.gov',
    BASE_URL: 'https://www.va.gov',
  },
  vagovstaging: {
    API_URL: 'https://staging-api.va.gov',
    BASE_URL: 'https://staging.va.gov',
  },
  vagovdev: {
    API_URL: 'https://dev-api.va.gov',
    BASE_URL: 'https://dev.va.gov',
  },
  localhost: {
    API_URL: `http://${location.hostname}:3000`,
    BASE_URL: `http://${location.hostname}:3001`,
  },
  e2e: {
    API_URL: `http://localhost:${process.env.API_PORT || 3000}`,
    BASE_URL: `http://localhost:${process.env.WEB_PORT || 3333}`,
  },
};

function getEnvironment() {
  let platform = 'localhost';

  if (location.port === `${process.env.WEB_PORT || 3333}`) {
    platform = 'e2e';
  } else {
    platform = __BUILDTYPE__;
  }

  return _Environments[platform];
}

const environment = getEnvironment();
module.exports = environment;
