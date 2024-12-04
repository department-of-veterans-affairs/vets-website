import { generateCCD, downloadCCD } from '../api/MrApi';
import { Actions } from '../util/actionTypes';
import { addAlert } from './alerts';
import * as Constants from '../util/constants';

export const genAndDownloadCCD = (firstName, lastName) => async dispatch => {
  dispatch({ type: Actions.Downloads.GENERATE_CCD });
  try {
    // GET LIST OF CCDs
    const generate = await generateCCD();

    // SUCCESSFUL CCD GENERATION
    if (generate[0]?.status === 'COMPLETE') {
      // getting the timestamp and filename for download
      const timestamp = generate[0].dateGenerated;
      const timestampDate = new Date(timestamp);
      const fileName = `VA-Continuity-of-care-document-${
        firstName !== null ? `${firstName}-` : ''
      }${lastName}-${timestampDate.getMonth()}-${timestampDate.getDate()}-${timestampDate.getFullYear()}_${timestampDate.getHours() %
        12 || 12}${timestampDate.getMinutes()}${timestampDate.getSeconds()}${
        timestampDate.getHours() > 12 ? 'pm' : 'am'
      }`;

      // get the xml data from the api
      const xmlString = await downloadCCD(timestamp);

      // download the xml to the user
      dispatch({ type: Actions.Downloads.DOWNLOAD_CCD, response: timestamp });
      const blob = new Blob([xmlString], { type: 'application/xml' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      // ERROR IN GENERATION (API SIDE)
    } else if (generate[0]?.status === 'ERROR') {
      const timestamp = generate[0].dateGenerated;
      localStorage.setItem('lastCCDError', timestamp);
      dispatch({
        type: Actions.Downloads.CCD_GENERATION_ERROR,
        response: timestamp,
      });

      // RECURSIVELY LOOP
    } else {
      dispatch(genAndDownloadCCD(firstName, lastName));
    }
    // ERROR HANDLING
  } catch (error) {
    dispatch({ type: Actions.Downloads.CANCEL_CCD });
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
    throw error;
  }
};
