import { REPORT_INITIALIZED } from '../../utils/actionTypes';

export const initializeRepresentativeReport = () => async dispatch => {
  dispatch({
    type: REPORT_INITIALIZED,
    payload: {},
  });
};
