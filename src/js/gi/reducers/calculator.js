import { CALCULATOR_INPUTS_CHANGED } from '../actions';

const INITIAL_STATE = {
  inState: 'yes',
  tuitionFees: '$0',
  books: '$0',
  yellowRibbonRecipient: 'no',
  yellowRibbonAmount: '$0',
  scholarships: '$0',
  tuitionAssist: '$0',
  enrolled: '1.0',
  enrolledOld: 'full',
  calendar: 'semesters',
  working: '30',
  numberNontradTerms: '2',
  lengthNontradTerms: '3',
  kickerEligible: 'no',
  kickerAmount: '$200',
  buyUp: 'no',
  buyUpAmount: '$600',
};

export default function (state = INITIAL_STATE, action) {
  const field = action.field;
  const value = action.value;

  switch (action.type) {
    case CALCULATOR_INPUTS_CHANGED:
      /*
      TODO: Consistently format dollar amounts.
      const isDollarAmount = [
          'tuitionFees',
          'books',
          'yellowRibbonAmount',
          'scholarships',
          'tuitionAssist',
          'kickerAmount',
          'buyUpAmount'
        ].includes(field);

      if (isDollarAmount) {
        if (value[0] !== '$') {
          value = `$${value}`;
        }
      }
      */

      return {
        ...state,
        [field]: value,
      };
    default:
      return state;
  }
}
