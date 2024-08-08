import { REPORT_CANCELLED } from '../../utils/actionTypes';

export const cancelRepresentativeReport = () => async dispatch => {
  dispatch({
    type: REPORT_CANCELLED,
    payload: {},
  });
};
