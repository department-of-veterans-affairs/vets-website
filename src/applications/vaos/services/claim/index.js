import { apiRequestWithUrl, mapToFHIRErrors } from '../utils';

/**
 * Fetch a claim id for a given appointment based on start time
 *
 * @export
 * @async
 * @param {String} startDate Date in YYYY-MM-DDThh:mm:ssZ format
 * @returns {String} claimId A claim id
 */
export async function getClaim(startDateTime) {
  try {
    const response = await apiRequestWithUrl(
      `/vaos/v2/claims?date=${startDateTime}`,
      {
        method: 'GET',
      },
    );
    return response.data;
  } catch (e) {
    if (e.errors) {
      throw mapToFHIRErrors(e.errors);
    }
    throw e;
  }
}
