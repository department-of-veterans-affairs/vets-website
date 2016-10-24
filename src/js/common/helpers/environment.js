const _Environments = {
  production: { API_URL: 'https://dev-api.vets.gov', BASE_URL: 'https://www.vets.gov' },
  staging: { API_URL: 'https://staging-api.vets.gov', BASE_URL: 'https://staging.vets.gov' },
  development: { API_URL: 'https://dev-api.vets.gov', BASE_URL: 'https://dev.vets.gov' },
};

function getEnvironment() {
  const platform = __BUILDTYPE__;
  return _Environments[platform];
}

const environment = getEnvironment();
module.exports = environment;
