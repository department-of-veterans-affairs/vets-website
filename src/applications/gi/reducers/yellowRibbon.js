import set from 'lodash/fp';
import { ELIGIBILITY_CHANGED } from '../actions';

const INITIAL_STATE = {
  calculated: {
    inputs: {
      beneficiaryLocationQuestion: true,
      books: false,
      buyUp: false,
      calendar: true,
      enrolled: true,
      enrolledOld: false,
      inState: false,
      kicker: true,
      scholarships: true,
      tuition: true,
      tuitionAssist: false,
      working: false,
      yellowRibbon: true,
    },
  },
};

export default function(state = INITIAL_STATE, action) {
  if (action.type === ELIGIBILITY_CHANGED) {
    const { field, value } = action;

    const newState = {
      ...state,
    };

    if (field === 'militaryStatus') {
      return set('yellowRibbon', value === 'active duty', newState);
    }
  }

  return state;
}
