import {
  FETCH_DATA_SUCCESS,
  FETCH_DATA_FAILURE,
  UPDATE_DATA_FAILURE,
  UPDATE_DATA_SUCCESS,
} from './dlcTypes';

export const fetchDataSuccess = data => ({
  type: FETCH_DATA_SUCCESS,
  payload: data,
});

export const fetchDataFailure = () => ({
  type: FETCH_DATA_FAILURE,
});

export const updateDataSuccess = () => ({
  type: UPDATE_DATA_SUCCESS,
});

export const updateDataFailure = () => ({
  type: UPDATE_DATA_FAILURE,
});

export const getDLCData = () => async dispatch => {
  try {
    const { data } = await fetch('http://localhost:3000/v0/dalc/hab/1010');
    dispatch({ type: FETCH_DATA_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_DATA_FAILURE, payload: 'error fetching data' });
  }
};

export const updateDLCData = id => async dispatch => {
  try {
    const { data } = await fetch('http://localhost:3000/v0/dalc/hab/1010', {
      method: 'PUT', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    dispatch({ type: UPDATE_DATA_SUCCESS, id, payload: data });
  } catch (error) {
    dispatch({ type: UPDATE_DATA_FAILURE, payload: 'error updating data' });
  }
};
