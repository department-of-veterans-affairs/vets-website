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
  let REQUEST_URL = '';

  if (!environment.isProduction()) {
    REQUEST_URL = `https://staging-api.va.gov${CONTEXT_ROOT}/${zipCode}/${year}/${dependents}`;
  } else {
    REQUEST_URL = `https://api.va.gov${CONTEXT_ROOT}/${zipCode}/${year}/${dependents}`;
  }

  try {
    const response = await fetchWithTimeout(REQUEST_URL);

    return await response.json();
  } catch (error) {
    return null;
  }
};

export const validateZip = async zip => {
  const CONTEXT_ROOT = '/income_limits/v1/validateZipCode';
  let REQUEST_URL = '';

  if (!environment.isProduction()) {
    REQUEST_URL = `https://staging-api.va.gov${CONTEXT_ROOT}/${zip}`;
  } else {
    REQUEST_URL = `https://api.va.gov${CONTEXT_ROOT}/${zip}`;
  }

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
