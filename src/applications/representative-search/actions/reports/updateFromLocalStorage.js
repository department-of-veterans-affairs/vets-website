import { REPORT_ITEMS_UPDATED } from '../../utils/actionTypes';

/**
 * On page load, syncs redux state with vaReports object in local storage
 *
 * @param {Object} localStorageArray all reports that have been pushed to storage
 */

export const updateFromLocalStorage = localStorageArray => ({
  type: REPORT_ITEMS_UPDATED,
  payload: localStorageArray,
});
