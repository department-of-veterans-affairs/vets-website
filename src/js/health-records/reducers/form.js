import set from 'lodash/fp/set';
import { mapValues } from 'lodash';
import { reportTypes } from '../config';


const initialState = {
  dateOption: '3mo',
  dateRange: {
    start: null,
    end: null,
  },
  reportTypes: {},
  ready: false,
  requestDate: null,
};

// map of all reportTypes in form { reportTypeValue: boolean }
Object.keys(reportTypes).forEach(section => {
  reportTypes[section].children.forEach(child => {
    initialState.reportTypes[child.value] = false;
  });
});

export default function form(state = initialState, action) {
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
      return set('ready', true, {
        ...state,
        requestDate: new Date().toISOString(),
      });
    case 'FORM_FAILURE':
      return set('ready', false, state);
    case 'FORM_RESET':
      return initialState;
    default:
      return state;
  }
}
