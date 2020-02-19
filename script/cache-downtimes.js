require('isomorphic-fetch');

const PAGERDUTY_API_BASE_URI = 'https://api.pagerduty.com';
const PAGERDUTY_TOKEN = 'qr8xUxLbCSjAvFyv5st_';
const MAINTENANCE_WINDOWS_URI = `${PAGERDUTY_API_BASE_URI}/maintenance_windows`;
const API_SERVICE_ID = '';

const REQUEST_OPTIONS = {
  headers: {
    Authorization: `Token token=${PAGERDUTY_TOKEN}`,
    'Content-Type': 'application/json',
  },
};

const apiWindows = ({ services }) =>
  services.some(service => service.id === API_SERVICE_ID);

fetch(MAINTENANCE_WINDOWS_URI, REQUEST_OPTIONS)
  .then(response => response.json())
  .then((response) => { console.log(response) })
  .catch(console.log);
