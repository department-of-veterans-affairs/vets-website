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

// Shared media type map for CCD downloads
const MEDIA_TYPE_MAP = {
  xml: 'application/xml;charset=utf-8',
  html: 'text/html;charset=utf-8',
  pdf: 'application/pdf',
};

/**
 * Validates file type and returns corresponding media type
 * @param {string} fileType - File extension (xml, html, pdf)
 * @returns {string} Media type
 * @throws {Error} If file type is unsupported
 */
const validateAndGetMediaType = fileType => {
  const extension = String(fileType).toLowerCase();
  const mediaType = MEDIA_TYPE_MAP[extension];

  if (!mediaType) {
    throw new Error(`Unsupported file type: ${extension}`);
  }

  return mediaType;
};

/**
 * Creates a blob with the correct MIME type
 * @param {Response} response - Fetch API response
 * @param {string} mediaType - MIME type to apply
 * @returns {Promise<Blob>} Blob with correct type
 */
const createBlobWithType = async (response, mediaType) => {
  const blob = await response.blob();
  // If blob doesn't have a type, set it explicitly
  return blob.type ? blob : blob.slice(0, blob.size, mediaType);
};

/**
 * Triggers browser file download
 * @param {Blob} blob - File blob to download
 * @param {string} fileName - Name for downloaded file
 */
const triggerFileDownload = (blob, fileName) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
};

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

      // Validate file type and create blob with correct MIME type
      const mediaType = validateAndGetMediaType(fileType);
      const blob = await createBlobWithType(response, mediaType);

      // download the file to the user
      dispatch({ type: Actions.Downloads.DOWNLOAD_CCD, response: timestamp });
      triggerFileDownload(blob, fileName);
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

    // Validate file type and create blob with correct MIME type
    const mediaType = validateAndGetMediaType(fileType);
    const blob = await createBlobWithType(response, mediaType);

    dispatch({
      type: Actions.Downloads.DOWNLOAD_CCD,
      response: new Date().toISOString(),
    });

    triggerFileDownload(blob, fileName);
  } catch (error) {
    dispatch({ type: Actions.Downloads.CANCEL_CCD });

    if (error.status === 404 || error.message?.includes('not found')) {
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
