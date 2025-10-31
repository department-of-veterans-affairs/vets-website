import { apiRequest } from 'platform/utilities/api';
import {
  CLAIMANT_INFO_ENDPOINT,
  FETCH_CLAIMANT_INFO,
  FETCH_CLAIMANT_INFO_FAILURE,
  FETCH_CLAIMANT_INFO_SUCCESS,
} from './constants';

export const fetchClaimantInfo = () => async dispatch => {
  dispatch({ type: FETCH_CLAIMANT_INFO });

  try {
    const response = await apiRequest(CLAIMANT_INFO_ENDPOINT);

    dispatch({
      type: FETCH_CLAIMANT_INFO_SUCCESS,
      payload: response,
    });
  } catch (error) {
    dispatch({
      type: FETCH_CLAIMANT_INFO_FAILURE,
      error,
    });
  }
};
