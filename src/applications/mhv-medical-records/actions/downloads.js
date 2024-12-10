import { Actions } from '../util/actionTypes';

export const updateReportDateRange = (fromDate, toDate) => async dispatch => {
  dispatch({
    type: Actions.Downloads.SET_DATE_FILTER,
    response: `${fromDate}<->${toDate}`,
  });
};

export const updateReportRecordType = selectedTypes => async dispatch => {
  dispatch({
    type: Actions.Downloads.SET_RECORD_FILTER,
    response: selectedTypes,
  });
};
