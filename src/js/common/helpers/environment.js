const _Environments = {
  staging: { API_URL: 'https://dev.vets.gov/api', BASE_URL: 'https://dev.vets.gov/' },
  production: { API_URL: 'https://dev.vets.gov/api', BASE_URL: 'https://dev.vets.gov/' },
  development: { API_URL: 'http://localhost:3000', BASE_URL: 'http://localhost:3001' },
};

function getEnvironment() {
  const platform = process.env.NODE_ENV;
  return _Environments[platform];
}

const environment = getEnvironment();
module.exports = environment;
