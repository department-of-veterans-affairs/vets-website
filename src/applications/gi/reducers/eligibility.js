import localStorage from 'platform/utilities/storage/localStorage';

import { ELIGIBILITY_CHANGED } from '../actions';
import { ELIGIBILITY_LIFESPAN } from '../constants';

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
  let newState = { ...state };

  if (action.type === ELIGIBILITY_CHANGED) {
    const { field, value } = action;

    newState = {
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

    newState.timestamp = new Date().getTime();
    localStorage.setItem('giEligibility', JSON.stringify(newState));

    return newState;
  }

  const storedEligibility = JSON.parse(localStorage.getItem('giEligibility'));

  if (
    storedEligibility?.timestamp &&
    new Date().getTime() - storedEligibility.timestamp < ELIGIBILITY_LIFESPAN
  ) {
    delete storedEligibility.timestamp;
    newState = {
      ...newState,
      ...storedEligibility,
    };
  }

  return newState;
}
