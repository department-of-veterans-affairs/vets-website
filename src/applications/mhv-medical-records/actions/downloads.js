import { format } from 'date-fns';
import {
  generateCCD,
  downloadCCD,
  downloadCCDV2 as downloadCCDV2Api,
} from '../api/MrApi';
import { Actions } from '../util/actionTypes';
import { addAlert, clearAlerts } from './alerts';
import * as Constants from '../util/constants';

const INITIAL_BACKOFF = 1000; // 1 second
const BACKOFF_FACTOR = 1.05; // 5% increase
const MAX_DURATION = 60000; // 1 minute total

export const genAndDownloadCCD = (
  firstName,
  lastName,
  fileType = 'xml',
  backoff = INITIAL_BACKOFF,
  startTime = Date.now(),
) => async dispatch => {
  // Clear any previous error alerts before attempting new download
  dispatch(clearAlerts());

  dispatch({ type: Actions.Downloads.GENERATE_CCD });

  try {
    // GET LIST OF CCDs
    const generate = await generateCCD();

    // SUCCESSFUL CCD GENERATION
    if (generate[0]?.status === 'COMPLETE') {
      // getting the timestamp and filename for download
      const timestamp = generate[0].dateGenerated;
      const timestampDate = new Date(timestamp);

      const extension = fileType.toLowerCase();
      const fileName = `VA-Continuity-of-care-document-${
        firstName ? `${firstName}-` : ''
      }${lastName}-${format(timestampDate, 'M-d-yyyy_hhmmssaaa')}.${extension}`;

      // get the xml data from the api
      const response = await downloadCCD(timestamp, fileType);

      // decide how to read response
      const ext = String(fileType).toLowerCase();
      const mediaTypeMap = {
        xml: 'application/xml;charset=utf-8',
        html: 'text/html;charset=utf-8',
        pdf: 'application/pdf',
      };
      if (!mediaTypeMap[ext]) {
        throw new Error(`Unsupported file type: ${ext}`);
      }

      let blob = await response.blob();
      blob = blob.type
        ? blob
        : blob.slice(0, blob.size, mediaTypeMap[fileType]);

      // download the xml to the user
      dispatch({ type: Actions.Downloads.DOWNLOAD_CCD, response: timestamp });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }

    // ERROR IN GENERATION (API SIDE)
    else if (generate[0]?.status === 'ERROR') {
      const timestamp = generate[0].dateGenerated;
      localStorage.setItem('lastCCDError', timestamp);
      dispatch({
        type: Actions.Downloads.CCD_GENERATION_ERROR,
        response: timestamp,
      });
    }

    // RETRY WITH BACKOFF
    else {
      const elapsed = Date.now() - startTime;

      // if we have exceeded 1 minute, throw an error
      if (elapsed >= MAX_DURATION) {
        throw new Error('CCD generation timed out.');
      }

      const nextBackoff = backoff * BACKOFF_FACTOR;
      setTimeout(() => {
        dispatch(
          genAndDownloadCCD(
            firstName,
            lastName,
            fileType,
            nextBackoff,
            startTime,
          ),
        );
      }, backoff);
    }
  } catch (error) {
    dispatch({ type: Actions.Downloads.CANCEL_CCD });
    dispatch(addAlert(Constants.ALERT_TYPE_CCD_ERROR, error));
  }
};

/**
 * Downloads CCD from Oracle Health (V2 endpoint) - Direct download
 *
 * Unlike V1 which requires generate->poll->download cycle, V2 downloads immediately.
 * This is possible because Oracle Health's FHIR API is fast enough for on-demand generation.
 */
export const downloadCCDV2 = (
  firstName,
  lastName,
  fileType = 'xml',
) => async dispatch => {
  // Clear any previous error alerts before attempting new download
  dispatch(clearAlerts());

  dispatch({ type: Actions.Downloads.GENERATE_CCD });

  try {
    const response = await downloadCCDV2Api(fileType);
    const extension = fileType.toLowerCase();

    // Filename includes "OH" to distinguish Oracle Health data from VistA
    // Example: VA-Continuity-of-care-document-OH-John-Doe-10-28-2025_023755pm.xml
    const fileName = `VA-Continuity-of-care-document-OH-${
      firstName ? `${firstName}-` : ''
    }${lastName}-${format(new Date(), 'M-d-yyyy_hhmmssaaa')}.${extension}`;

    const mediaTypeMap = {
      xml: 'application/xml;charset=utf-8',
      html: 'text/html;charset=utf-8',
      pdf: 'application/pdf',
    };

    if (!mediaTypeMap[extension]) {
      throw new Error(`Unsupported file type: ${extension}`);
    }

    let blob = await response.blob();
    blob = blob.type ? blob : blob.slice(0, blob.size, mediaTypeMap[fileType]);

    dispatch({
      type: Actions.Downloads.DOWNLOAD_CCD,
      response: new Date().toISOString(),
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  } catch (error) {
    dispatch({ type: Actions.Downloads.CANCEL_CCD });

    if (error.status === 404 || error.message?.includes('not found')) {
      // Oracle Health records may not be available yet for some patients
      // (e.g., recently transferred from VistA). Suggest fallback to VistA CCD.
      const customError = new Error(
        'Your Oracle Health medical records are not yet available. Please download your CCD from the Legacy System section above, which contains your complete medical history.',
      );
      dispatch(addAlert('Oracle Health Records Not Available', customError));
    } else {
      dispatch(addAlert(Constants.ALERT_TYPE_CCD_ERROR, error));
    }
  }
};

export const updateReportDateRange = (
  option,
  fromDate,
  toDate,
) => async dispatch => {
  dispatch({
    type: Actions.Downloads.SET_DATE_FILTER,
    response: {
      option,
      fromDate,
      toDate,
    },
  });
  dispatch({ type: Actions.BlueButtonReport.CLEAR_APPOINTMENTS });
};

export const updateReportRecordType = selectedTypes => async dispatch => {
  dispatch({
    type: Actions.Downloads.SET_RECORD_FILTER,
    response: selectedTypes,
  });
};

export const updateReportFileType = selectedType => async dispatch => {
  dispatch({
    type: Actions.Downloads.SET_FILE_TYPE_FILTER,
    response: selectedType,
  });
};
