import {
  FETCH_DATA_SUCCESS,
  FETCH_DATA_FAILURE,
  UPDATE_DATA_FAILURE,
  UPDATE_DATA_SUCCESS,
} from '../constants';
import { getDlcDataApi, updateDlcDataApi } from '../api';

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
    const { data } = await getDlcDataApi();
    dispatch({ type: FETCH_DATA_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_DATA_FAILURE, payload: 'error fetching data' });
  }
};

export const updateDLCData = id => async dispatch => {
  try {
    const { data } = await updateDlcDataApi();
    dispatch({ type: UPDATE_DATA_SUCCESS, id, payload: data });
  } catch (error) {
    dispatch({ type: UPDATE_DATA_FAILURE, payload: 'error updating data' });
  }
};
