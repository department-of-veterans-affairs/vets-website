import { ELIGIBILITY_CHANGED } from '../actions';

const INITIAL_STATE = {
  dropdowns: {
    militaryStatus: true,
    spouseActiveDuty: false,
    giBillChapter: true,
    cumulativeService: true,
    enlistmentService: false,
    consecutiveService: false,
    eligForPostGIBill: false,
    numberOfDependents: false
  },
  militaryStatus: 'veteran',
  giBillChapter: '33',
  cumulativeService: '1.0',
  onlineClasses: 'no',
  spouseActiveDuty: 'no',
  enlistmentService: '3',
  consecutiveService: '0.8',
  eligForPostGiBill: 'no',
  numberOfDependents: '0',
};

export default function (state = INITIAL_STATE, action) {
  const field = action.field;
  const value = action.value;

  // Updates dependent dropdown visibility.
  // Updates state with default values accordingly.
  // Sets the value of hidden dropdown fields to their defaults.
  switch (action.type) {
    case ELIGIBILITY_CHANGED:
      if (field === 'militaryStatus') {
        return {
          ...state,
          [field]: value,
          dropdowns: {
            ...state.dropdowns,
            spouseActiveDuty: value === 'spouse',
          },
          spouseActiveDuty: 'no',
        };
      }
      if (field === 'giBillChapter') {
        return {
          ...state,
          [field]: value,
          dropdowns: {
            ...state.dropdowns,
            cumulativeService: value === '33',
            enlistmentService: value === '30',
            consecutiveService: value === '1607',
            eligForPostGiBill: value === '31',
            numberOfDependents: value === '31',
          },
          cumulativeService: '1.0',
          enlistmentService: '3',
          consecutiveService: '0.8',
          eligForPostGiBill: 'no',
          numberOfDependents: '0',
        };
      }
      return {
        ...state,
        [field]: value,
      };
    default:
      return state;
  }
}
