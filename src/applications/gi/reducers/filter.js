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
  vetTecProvider: false,
  preferredProvider: false,
});

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case INSTITUTION_FILTER_CHANGED:
      return {
        ...INITIAL_STATE,
        ...action.filter,
      };
    default:
      return { ...state };
  }
}
