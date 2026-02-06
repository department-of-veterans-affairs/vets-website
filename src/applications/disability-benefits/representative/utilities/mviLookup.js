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

  // DEBUG: Log the incoming date format
  // eslint-disable-next-line no-console
  console.log('[MVI Lookup] dateOfBirth value:', dateOfBirth, 'type:', typeof dateOfBirth);

  // Backend expects snake_case parameter names
  // Note: The backend expects 'dob' not 'birth_date' (matching ARP ClaimantSearchPage)
  /* eslint-disable camelcase */
  const searchPayload = {
    first_name: fullName?.first,
    middle_name: fullName?.middle || '',
    last_name: fullName?.last,
    ssn: ssn?.replace(/-/g, ''), // Remove dashes from SSN
    dob: dateOfBirth,
  };
  /* eslint-enable camelcase */

  // DEBUG: Log the full payload being sent
  // eslint-disable-next-line no-console
  console.log('[MVI Lookup] Sending payload:', JSON.stringify(searchPayload, null, 2));

  const baseUrl = `${environment.API_URL}/${API_VERSION}`;
  const url = `${baseUrl}/claimant/search`;

  const csrfToken = localStorage.getItem('csrfToken');

  const settings = {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Key-Inflection': 'camel',
      'X-CSRF-Token': csrfToken,
      'Source-App-Name': 'representative',
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
 * Extract claimant data from MVI lookup response
 *
 * The claimant search endpoint returns claimant information including:
 * - id: A UUID that identifies the claimant in the ARP system
 * - firstName, lastName, city, state, etc.
 *
 * Note: The actual ICN (Integration Control Number) is NOT returned to the
 * frontend for security reasons. The backend will use the claimant UUID to
 * look up the ICN when submitting the 526EZ form.
 *
 * @param {Object} mviResponse - Response from claimant search
 * @returns {Object|null} - Claimant data object or null if not found
 */
export function extractClaimantData(mviResponse) {
  const data = mviResponse?.data;
  
  if (!data?.id) {
    return null;
  }
  
  return {
    // The claimant UUID - used to identify the veteran in subsequent API calls
    // The backend will resolve this to the actual ICN when needed
    claimantId: data.id,
    // Additional claimant info that can be displayed/verified
    firstName: data.firstName,
    lastName: data.lastName,
    city: data.city,
    state: data.state,
    postalCode: data.postalCode,
    representative: data.representative,
  };
}

export default {
  claimantSearch,
  extractClaimantData,
};
