import { generateCCD, downloadCCD } from '../api/MrApi';
import { Actions } from '../util/actionTypes';
import { addAlert } from './alerts';
import * as Constants from '../util/constants';

export const genAndDownloadCCD = (firstName, lastName) => async dispatch => {
  dispatch({ type: Actions.Downloads.GENERATE_CCD });
  try {
    const generate = await generateCCD();
    if (generate[0]?.status === 'COMPLETE') {
      const timestamp = generate[0].dateGenerated;
      const timestampDate = new Date(timestamp);

      const fileName = `VA-Continuity-of-care-document-${
        firstName !== null ? `${firstName}-` : ''
      }${lastName}-${timestampDate.getMonth()}-${timestampDate.getDate()}-${timestampDate.getFullYear()}_${timestampDate.getHours() %
        12 || 12}${timestampDate.getMinutes()}${timestampDate.getSeconds()}${
        timestampDate.getHours() > 12 ? 'pm' : 'am'
      }`;

      dispatch({ type: Actions.Downloads.DOWNLOAD_CCD, response: timestamp });
      downloadCCD(timestamp, fileName);
    } else if (generate[0]?.status === 'ERROR') {
      const timestamp = generate[0].dateGenerated;
      localStorage.setItem('lastCCDError', timestamp);
      dispatch({
        type: Actions.Downloads.CCD_GENERATION_ERROR,
        response: timestamp,
      });
    } else {
      dispatch(genAndDownloadCCD(firstName, lastName));
    }
  } catch (error) {
    dispatch({ type: Actions.Downloads.CANCEL_CCD });
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
    throw error;
  }
};
