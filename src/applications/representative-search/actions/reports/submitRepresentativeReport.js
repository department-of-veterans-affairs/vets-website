import * as Sentry from '@sentry/browser';

import {
  REPORT_SUBMITTED,
  REPORT_FAILED,
  REPORT_COMPLETE,
} from '../../utils/actionTypes';
import RepresentativeFinderApi from '../../api/RepresentativeFinderApi';

/**
 * Check for existing reports for a given rep (to avoid multiple reports with same id)
 * Then, pass new report to POST request
 * @param {Object} localStorageArray all reports that have been pushed to storage
 */

export const submitRepresentativeReport = newReport => {
  return async dispatch => {
    try {
      dispatch({
        type: REPORT_SUBMITTED,
        payload: {
          reportSubmissionInProgress: true,
        },
      });

      const storedReports = JSON.parse(localStorage.getItem('vaReports')) || [];
      const updatedReports = [...storedReports];

      // look for existing reports for a given representative
      const index = storedReports.findIndex(
        storedReport =>
          storedReport.representativeId === newReport.representativeId,
      );

      if (index !== -1) {
        updatedReports[index].reports = {
          ...storedReports[index].reports,
          ...newReport.reports,
        };
      } else {
        updatedReports.push(newReport);
      }

      // send to api, update local storage + redux state on successful response
      const reportResponse = await RepresentativeFinderApi.reportResult(
        newReport,
      );

      if (reportResponse.errors?.length > 0) {
        dispatch({
          type: REPORT_FAILED,
          payload: { reportSubmissionInProgress: false },
          error: reportResponse.errors,
        });
      } else {
        localStorage.setItem('vaReports', JSON.stringify(updatedReports));

        dispatch({
          type: REPORT_COMPLETE,
          payload: { updatedReports },
        });
      }
    } catch (error) {
      Sentry.withScope(scope => {
        scope.setExtra('error', error);
        Sentry.captureMessage('Error submitting representative report');
      });

      dispatch({
        type: REPORT_FAILED,
        payload: { reportSubmissionInProgress: false },
        error: error.message,
      });

      throw error;
    }
  };
};
