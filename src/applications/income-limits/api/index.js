import environment from 'platform/utilities/environment';

const SERVER_ERROR_REGEX = /^5\d{2}$/;
const CLIENT_ERROR_REGEX = /^4\d{2}$/;

export const getData = async ({ zipCode, year, dependents }) => {
  const CONTEXT_ROOT = '/income_limits/v1/limitsByZipCode';
  const REQUEST_URL = `${
    environment.API_URL
  }${CONTEXT_ROOT}/${zipCode}/${year}/${dependents}`;
  // For testing locally, use the below REQUEST_URL and comment out the CONTEXT_ROOT and REQUEST_URL above
  // const REQUEST_URL = `https://api.va.gov/income_limits/v1/limitsByZipCode/${zipCode}/${year}/${dependents}`;

  return new Promise((resolve, reject) => {
    fetch(REQUEST_URL)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }

        return response?.json();
      })
      .then(data => resolve(data), error => reject(error));
  });
};

export const isServerError = errCode => SERVER_ERROR_REGEX.test(errCode);

export const isClientError = errCode => CLIENT_ERROR_REGEX.test(errCode);
