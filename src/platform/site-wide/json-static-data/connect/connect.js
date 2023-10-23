import {
  FETCH_STATIC_DATA_STARTED,
  FETCH_STATIC_DATA_SUCCEEDED,
} from 'platform/site-wide/json-static-data/actions';
import { fetchJsonStaticDataFile } from './fetch';

export const connectJsonStaticDataFile = async (dispatch, dataFile) => {
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

  const json = await fetchJsonStaticDataFile(fileName);

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
