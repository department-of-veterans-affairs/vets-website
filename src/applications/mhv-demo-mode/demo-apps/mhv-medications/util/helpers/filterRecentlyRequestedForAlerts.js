import { convertPrescription } from './convertPrescription';
import { isRefillTakingLongerThanExpected } from './isRefillTakingLongerThanExpected';

/**
 * Filter recently requested prescriptions to only include those taking longer than expected
 * @param {Array} recentlyRequested - Array of recently requested prescriptions
 * @returns {Array} - Filtered array of prescriptions taking longer than expected
 */
export const filterRecentlyRequestedForAlerts = recentlyRequested => {
  if (!Array.isArray(recentlyRequested)) return [];

  return recentlyRequested.reduce((alertList, prescription) => {
    const rx = convertPrescription(prescription);
    if (isRefillTakingLongerThanExpected(rx)) {
      alertList.push(rx);
    }
    return alertList;
  }, []);
};
