import { INSTITUTION_FILTERS_CHANGED } from '../actions';

const INITIAL_STATE = Object.freeze({
  category: 'school',
  type: 'ALL',
  country: 'ALL',
  state: 'ALL',
  institutionType: 'ALL',
  excludeWarningsAndCautionFlags: true,
  levelOfDegree: 'ALL',
  levelOfInstitution: {
    fourYear: true,
    twoYear: true,
  },
  major: '',
  inPersonClasses: 'yes',
});

export default function(state = INITIAL_STATE, action) {
  let newState = { ...state };

  if (action.type === INSTITUTION_FILTERS_CHANGED) {
    newState = {
      ...newState,
      ...action.payload,
    };
  }

  return newState;
}
