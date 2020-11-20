import { ELIGIBILITY_CHANGED } from '../actions';
import localStorage from 'platform/utilities/storage/localStorage';
import environment from 'platform/utilities/environment';

const INITIAL_STATE = Object.freeze({
  militaryStatus: 'veteran',
  giBillChapter: '33',
  cumulativeService: '1.0',
  onlineClasses: 'no',
  spouseActiveDuty: 'no',
  enlistmentService: '3',
  consecutiveService: '0.8',
  eligForPostGiBill: 'no',
  numberOfDependents: '0',
  learningFormat: {
    inPerson: false,
    online: false,
  },
});

export default function(state = INITIAL_STATE, action) {
  if (action.type === ELIGIBILITY_CHANGED) {
    const { field, value } = action;

    let newState = {
      ...state,
      [field]: value,
    };

    if (field === 'militaryStatus') {
      newState = {
        ...newState,
        spouseActiveDuty: 'no',
      };
    }

    if (field === 'giBillChapter') {
      newState = {
        ...newState,
        cumulativeService: '1.0',
        enlistmentService: '3',
        consecutiveService: '0.8',
        eligForPostGiBill: 'no',
        numberOfDependents: '0',
      };
    }

    // Fix for 7528 and 8228
    if (!environment.isProduction()) {
      localStorage.setItem('giEligibility', JSON.stringify(newState));
    }

    return newState;
  }

  // Fix for 7528 and 8228
  return !environment.isProduction()
    ? {
        ...state,
        ...JSON.parse(localStorage.getItem('giEligibility')),
      }
    : state;
}
