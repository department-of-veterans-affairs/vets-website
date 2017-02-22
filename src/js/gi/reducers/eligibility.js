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
  military_status: 'veteran',
  gi_bill_chapter: '33',
  cumulative_service: '1.0',
  online_classes: 'no',
  spouse_active_duty: 'no',
  enlistment_service: '3',
  consecutive_service: '0.8',
  elig_for_post_gi_bill: 'no',
  number_of_dependents: '0',
};

export default function (state = INITIAL_STATE, action) {
  const field = action.field;
  const value = action.value;

  // Updates dependent dropdown visibility.
  // Updates state with default values accordingly.
  // Sets the value of hidden dropdown fields to their defaults.
  switch (action.type) {
    case ELIGIBILITY_CHANGED:
      if (field === 'military_status') {
        return {
          ...state,
          [field]: value,
          dropdowns: {
            ...state.dropdowns,
            spouseActiveDuty: value === 'spouse',
          },
          spouse_active_duty: 'no',
        };
      }
      if (field === 'gi_bill_chapter') {
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
          cumulative_service: '1.0',
          enlistment_service: '3',
          consecutive_service: '0.8',
          elig_for_post_gi_bill: 'no',
          number_of_dependents: '0',
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
