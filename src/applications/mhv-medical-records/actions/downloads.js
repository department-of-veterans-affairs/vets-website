import { generateCCD, downloadCCD } from '../api/MrApi';
import { Actions } from '../util/actionTypes';
import { addAlert } from './alerts';
import * as Constants from '../util/constants';

export const genAndDownloadCCD = () => async dispatch => {
  dispatch({ type: Actions.Downloads.GENERATE_CCD });
  try {
    const generate = await generateCCD();
    if (generate[0]?.status === 'COMPLETE') {
      const timestamp = generate[0].dateGenerated;

      dispatch({ type: Actions.Downloads.DOWNLOAD_CCD, response: timestamp });
      downloadCCD(timestamp);
    } else {
      dispatch(genAndDownloadCCD());
    }
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
    throw error;
  }
};
