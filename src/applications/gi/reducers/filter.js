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
  stemIndicator: false,
  typeName: 'ALL',
  preferredProvider: false,
  provider: [],
});

export default function(state = INITIAL_STATE, action) {
  return action.type === INSTITUTION_FILTER_CHANGED
    ? {
        ...INITIAL_STATE,
        ...action.filter,
      }
    : { ...state };
}
