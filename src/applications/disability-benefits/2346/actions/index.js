import {
  FETCH_DATA_SUCCESS,
  FETCH_DATA_FAILURE,
  UPDATE_DATA_FAILURE,
  UPDATE_DATA_SUCCESS,
  CHECKBOX_STATE_UPDATE
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

export const checkboxStateUpdate = checkboxState => ({
  type: CHECKBOX_STATE_UPDATE,
  payload: checkboxState
});

 // BUG: Checkbox state defects -@maharielrosario at 12/30/2019, 5:58:40 PM
 // Checkbox state overwrites DLC API data
export const updateCheckboxState = state => async dispatch => {
  try {
    dispatch({ type: CHECKBOX_STATE_UPDATE, payload: !state });
  } catch (error) {
    dispatch({ type: CHECKBOX_STATE_UPDATE, payload: error });
  }
}

export const getDLCData = () => async dispatch => {
  try {
    const data  = await getDLCDataApi();
    dispatch(fetchDataSuccess(data));
  } catch (error) {
    dispatch(fetchDataFailure(error, 'failed to retrieve data from api'));
  }
};

export const updateDLCData = id => async dispatch => {
  try {
    const  data  = await updateDLCDataApi();
    dispatch({ type: UPDATE_DATA_SUCCESS, id, payload: data });
  } catch (error) {
    dispatch({ type: UPDATE_DATA_FAILURE, payload: error });
  }
};
