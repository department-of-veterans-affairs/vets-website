import environment from 'platform/utilities/environment';

// https://dmitripavlutin.com/timeout-fetch-request/
const fetchWithTimeout = async (resource, options = {}) => {
  const { timeout = 5000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });

  clearTimeout(id);

  return response;
};

export const getLimits = async ({ zipCode, year, dependents }) => {
  const CONTEXT_ROOT = '/income_limits/v1/limitsByZipCode';
  const REQUEST_URL = `${
    environment.API_URL
  }${CONTEXT_ROOT}/${zipCode}/${year}/${dependents}`;
  // For testing locally, use the below REQUEST_URL and comment out the CONTEXT_ROOT and REQUEST_URL above
  // const REQUEST_URL = `https://api.va.gov/income_limits/v1/limitsByZipCode/${zipCode}/${year}/${dependents}`;

  try {
    const response = await fetchWithTimeout(REQUEST_URL);

    return await response.json();
  } catch (error) {
    return null;
  }
};

export const validateZip = async zip => {
  const CONTEXT_ROOT = '/income_limits/v1/validateZipCode';
  const REQUEST_URL = `${environment.API_URL}${CONTEXT_ROOT}/${zip}`;
  // For testing locally, use the below REQUEST_URL and comment out the CONTEXT_ROOT and REQUEST_URL above
  // const REQUEST_URL = `https://api.va.gov/income_limits/v1/validateZipCode/${zip}`;

  try {
    const response = await fetchWithTimeout(REQUEST_URL);

    if (!response.ok) {
      return {
        // eslint-disable-next-line camelcase
        zip_is_valid: false,
        status: response.status,
      };
    }

    return await response?.json();
  } catch (error) {
    return null;
  }
};
