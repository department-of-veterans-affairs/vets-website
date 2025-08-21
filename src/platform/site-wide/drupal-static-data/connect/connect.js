import {
  FETCH_STATIC_DATA_STARTED,
  FETCH_STATIC_DATA_SUCCEEDED,
} from 'platform/site-wide/drupal-static-data/actions';
import { fetchDrupalStaticDataFile } from './fetch';

export const connectDrupalStaticDataFile = async (dispatch, dataFile) => {
  if (!dataFile) {
    return;
  }

  const { fileName, preProcess, statePropName } = dataFile;

  dispatch({
    type: FETCH_STATIC_DATA_STARTED,
    payload: {
      statePropName,
      data: [],
    },
  });

  const json = await fetchDrupalStaticDataFile(fileName);

  if (json) {
    let data = json;
    if (preProcess) {
      data = preProcess(json);
    }
    dispatch({
      type: FETCH_STATIC_DATA_SUCCEEDED,
      payload: {
        statePropName,
        data,
      },
    });
  }
};
