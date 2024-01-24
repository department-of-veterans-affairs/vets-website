import * as Sentry from '@sentry/browser';

import {
  REPORT_STARTED,
  REPORT_FAILED,
  REPORT_COMPLETE,
} from '../../utils/actionTypes';
import RepresentativeFinderApi from '../../api/RepresentativeFinderApi';

export const submitRepresentativeReport = report => {
  return async dispatch => {
    try {
      dispatch({
        type: REPORT_STARTED,
        payload: {
          reportSubmissionInProgress: true,
        },
      });

      const reportResponse = await RepresentativeFinderApi.reportResult(report);

      if (reportResponse.errors?.length > 0) {
        dispatch({
          type: REPORT_FAILED,
          payload: { reportSubmissionInProgress: false },
          error: reportResponse.errors,
        });
      }

      dispatch({
        type: REPORT_COMPLETE,
        payload: { reportResponse, reportSubmissionInProgress: false },
      });
    } catch (error) {
      Sentry.withScope(scope => {
        scope.setExtra('error', error);
        Sentry.captureMessage('Error fetching accredited representatives');
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
