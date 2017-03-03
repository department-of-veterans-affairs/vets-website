import { CALCULATOR_INPUTS_CHANGED } from '../actions';

const INITIAL_STATE = {
  tuitionFees: '$0',
  yellowRibbonRecipient: 'no',
  yellowRibbonAmount: '$0',
  scholarships: '$0',
  enrolled: '1.0',
  calendar: 'semesters',
  numberNontradTerms: '2',
  lengthNontradTerms: '3',
  kickerEligible: 'no',
  kicker: '$200',
};

export default function (state = INITIAL_STATE, action) {
  const field = action.field;
  const value = action.value;

  switch (action.type) {
    case CALCULATOR_INPUTS_CHANGED:
      return {
        ...state,
        [field]: value,
      };
    default:
      return state;
  }
}
