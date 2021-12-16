import { INSTITUTION_FILTER_CHANGED } from '../actions';

const INITIAL_STATE = Object.freeze({
  category: 'school',
  type: 'ALL',
  country: 'ALL',
  state: 'ALL',
  studentVeteranGroup: false,
  yellowRibbonScholarship: false,
  principlesOfExcellence: false,
  eightKeysToVeteranSuccess: false,
  typeName: 'ALL',
  preferredProvider: false,
  provider: [],
  excludeWarnings: false,
  excludeCautionFlags: false,
  priorityEnrollment: false,
  independentStudy: false,
});

export default function(state = INITIAL_STATE, action) {
  return action.type === INSTITUTION_FILTER_CHANGED
    ? {
        ...INITIAL_STATE,
        ...action.filter,
      }
    : { ...state };
}
