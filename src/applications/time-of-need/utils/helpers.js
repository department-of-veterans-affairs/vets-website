// import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import * as Sentry from '@sentry/browser';

export function isVeteran(formData) {
  // Replace with your app’s logic
  return formData.isVeteran === true;
}

export function isAuthorizedAgent(formData) {
  // Replace with your app’s logic
  return formData.isAuthorizedAgent === true;
}

export function hasDeceasedPersons(formData) {
  return (
    Array.isArray(formData.currentlyBuriedPersons) &&
    formData.currentlyBuriedPersons.length > 0
  );
}

/**
 * Cached list of cemeteries to avoid refetching on every keystroke.
 * TTL is optional; for now we keep for the entire session.
 */
let cemeteriesCache = null;
let cemeteriesCachePromise = null;

/**
 * Fetch list of cemeteries (once) then optionally filter by a user query.
 * Signature matches autosuggest getOptions(userInput).
 * Returns Promise<[{ id, label }]>
 */
export function getCemeteries(query = '') {
  const normalizedQuery = (query || '').trim().toLowerCase();

  // If we already have a resolved cache, just filter synchronously.
  const filter = list =>
    !normalizedQuery
      ? list
      : list.filter(c => c.label.toLowerCase().includes(normalizedQuery));

  // If cached list is present
  if (cemeteriesCache) {
    return Promise.resolve(filter(cemeteriesCache));
  }

  // If a fetch is in flight, chain onto it
  if (cemeteriesCachePromise) {
    return cemeteriesCachePromise.then(filter).catch(() => []);
  }

  // Staging endpoint (testing)
  const apiUrl = 'https://staging-api.va.gov/simple_forms_api/v1/cemeteries';

  cemeteriesCachePromise = fetch(apiUrl, {
    credentials: 'include',
    headers: {
      'X-Key-Inflection': 'camel',
      'Source-App-Name': window.appName || 'time-of-need',
    },
  })
    .then(res => {
      if (!res.ok) {
        return Promise.reject(res);
      }
      return res.json();
    })
    .then(res => {
      cemeteriesCache =
        (res?.data || []).map(item => ({
          label: item?.attributes?.name,
          id: item?.id,
        })) || [];
      return filter(cemeteriesCache);
    })
    .catch(error => {
      // Capture only real Error objects; non-Error rejects (like Response) are ignored for Sentry stack traces
      if (error instanceof Error) {
        Sentry.captureException(error);
      }
      Sentry.captureMessage('time_of_need_cemeteries_error');
      cemeteriesCache = []; // prevent repeated failing calls
      return [];
    })
    .finally(() => {
      cemeteriesCachePromise = null;
    });

  return cemeteriesCachePromise;
}
