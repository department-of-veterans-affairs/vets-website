import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { fetchAndUpdateSessionExpiration } from 'platform/utilities/api';
import localStorage from 'platform/utilities/storage/localStorage';

const API_VERSION = 'accredited_representative_portal/v0';

/**
 * Perform MVI lookup to get the veteran's ICN
 *
 * This calls the ARP claimant search endpoint to find the veteran
 * in MVI using their name, SSN, and date of birth.
 *
 * @param {Object} veteranData - Veteran identifying information
 * @param {Object} veteranData.fullName - Name object with first, middle, last
 * @param {string} veteranData.ssn - Social Security number
 * @param {string} veteranData.dateOfBirth - Date of birth (YYYY-MM-DD)
 * @returns {Promise<Object>} - Response containing ICN if found
 */
export async function claimantSearch(veteranData) {
  const { fullName, ssn, dateOfBirth } = veteranData;

  const searchPayload = {
    firstName: fullName?.first,
    middleName: fullName?.middle || '',
    lastName: fullName?.last,
    ssn: ssn?.replace(/-/g, ''), // Remove dashes from SSN
    dateOfBirth,
  };

  const baseUrl = `${environment.API_URL}/${API_VERSION}`;
  const url = `${baseUrl}/claimant/search`;

  const csrfToken = localStorage.getItem('csrfToken');

  const settings = {
    method: 'POST',
    credentials: 'include',
    headers: {
      'X-Key-Inflection': 'camel',
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify(searchPayload),
  };

  const response = await fetchAndUpdateSessionExpiration(url, settings);

  // Update CSRF token if returned
  const newCsrfToken = response.headers.get('X-CSRF-Token');
  if (newCsrfToken && newCsrfToken !== csrfToken) {
    localStorage.setItem('csrfToken', newCsrfToken);
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `MVI lookup failed with status ${response.status}`,
    );
  }

  return response.json();
}

/**
 * Extract ICN from MVI lookup response
 *
 * @param {Object} mviResponse - Response from claimant search
 * @returns {string|null} - The veteran's ICN or null if not found
 */
export function extractICN(mviResponse) {
  // The structure may vary - check multiple possible locations
  // API may return icn or claimantId depending on the endpoint version
  const attributes = mviResponse?.data?.attributes;
  return (
    attributes?.icn ||
    attributes?.claimantId ||
    mviResponse?.icn ||
    mviResponse?.claimantId ||
    null
  );
}

export default {
  claimantSearch,
  extractICN,
};
