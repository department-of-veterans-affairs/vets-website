import { ELIGIBILITY_CHANGED } from '../actions';

const INITIAL_STATE = Object.freeze({
  expanded: false,
  militaryStatus: 'veteran',
  giBillChapter: '33a',
  cumulativeService: '1.0',
  onlineClasses: 'no',
  spouseActiveDuty: 'no',
  areYouActiveDuty: 'no',
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
    newState = {
      ...newState,
      ...action.payload,
    };

    if (newState.militaryStatus !== state.militaryStatus) {
      newState = {
        ...newState,
        spouseActiveDuty: 'no',
      };
    }

    if (newState.giBillChapter !== state.giBillChapter) {
      newState = {
        ...newState,
        cumulativeService: '1.0',
        enlistmentService: '3',
        consecutiveService: '0.8',
        eligForPostGiBill: 'no',
        numberOfDependents: '0',
      };
    }
  }

  return newState;
}
