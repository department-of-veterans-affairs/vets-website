import set from 'lodash/fp/set';
import { mapValues, forEach, reduce } from 'lodash';
import { reportTypes } from '../config';

// map of all reportTypes in form { reportTypeValue: boolean }
const reportTypeValues = reduce(reportTypes, (memo, v) => {
  forEach(v.children, c => {
    memo[c.value] = false; // eslint-disable-line no-param-reassign
  });
  return memo;
}, {});

const initialState = {
  dateOption: '3mo',
  dateRange: {
    start: null,
    end: null,
  },
  reportTypes: reportTypeValues,
  ui: {
    redirect: false
  }
};

export default function disclaimer(state = initialState, action) {
  switch (action.type) {
    case 'START_DATE_CHANGED':
      return set('dateRange.start', action.date, state);
    case 'END_DATE_CHANGED':
      return set('dateRange.end', action.date, state);
    case 'DATE_OPTION_CHANGED':
      return set('dateOption', action.dateOption, state);
    case 'REPORT_TYPE_TOGGLED':
      return set(`reportTypes.${action.reportType}`, action.checked, state);
    case 'ALL_REPORTS_TOGGLED':
      return set('reportTypes', mapValues(state.reportTypes, () => action.checked), state);
    case 'FORM_SUCCESS':
      return set('ui.redirect', true, state);
    case 'FORM_FAILURE':
      return set('ui.redirect', false, state);
    default:
      return state;
  }
}
