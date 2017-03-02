import { INSTITUTION_FILTER_CHANGED } from '../actions';

const INITIAL_STATE = {
  type: 'ALL',
  country: 'ALL',
  state: 'ALL',
  caution: false,
  studentVetGroup: false,
  yellowRibbonScholarship: false,
  principlesOfExcellence: false,
  eightKeysToVeteranSuccess: false,
  typeName: 'ALL',
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case INSTITUTION_FILTER_CHANGED:
      return {
        ...state,
        [action.field]: action.value
      };
    default:
      return state;
  }
}
