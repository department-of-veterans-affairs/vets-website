const _Environments = {
  production: { API_URL: 'https://api.vets.gov', BASE_URL: 'https://www.vets.gov' },
  staging: { API_URL: 'https://staging-api.vets.gov', BASE_URL: 'https://staging.vets.gov' },
  development: { API_URL: 'https://dev-api.vets.gov', BASE_URL: 'https://dev.vets.gov' },
  local: { API_URL: 'http://localhost:3000', BASE_URL: 'http://localhost:3001' },
  e2e: { API_URL: 'http://localhost:4000', BASE_URL: 'http://localhost:3333' }
};

function getEnvironment() {
  let platform;

  if (location.host === 'localhost:3001') {
    platform = 'local';
  } else if (location.host === 'localhost:3333') {
    platform = 'e2e';
  } else {
    platform = __BUILDTYPE__;
  }

  return _Environments[platform];
}

const environment = getEnvironment();
module.exports = environment;
