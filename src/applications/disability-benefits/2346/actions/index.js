import {
  FETCH_DATA_SUCCESS,
  FETCH_DATA_FAILURE,
  UPDATE_DATA_FAILURE,
  UPDATE_DATA_SUCCESS,
} from '../constants';
import { getDLCDataApi, updateDLCDataApi } from '../api';

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
    const data = await getDLCDataApi();
    dispatch(fetchDataSuccess(data));
  } catch (error) {
    dispatch(fetchDataFailure(error, 'failed to retrieve data from api'));
  }
};

export const updateDLCData = id => async dispatch => {
  try {
    const data = await updateDLCDataApi();
    dispatch({ type: UPDATE_DATA_SUCCESS, id, payload: data });
  } catch (error) {
    dispatch({ type: UPDATE_DATA_FAILURE, payload: error });
  }
};
