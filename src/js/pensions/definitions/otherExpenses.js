import currentOrPastDateUI from '../../common/schemaform/definitions/currentOrPastDate';
import ExpenseField from '../components/ExpenseField';

export default {
  'ui:options': {
    viewField: ExpenseField,
    itemName: 'Expense',
    keepInPageOnReview: true
  },
  items: {
    'ui:order': [
      'amount',
      'purpose',
      'date',
      'paidTo'
    ],
    amount: {
      'ui:title': 'Amount paid',
      'ui:options': {
        classNames: 'schemaform-currency-input'
      }
    },
    purpose: {
      'ui:title': 'Purpose (doctor fee, hospital charge, attorney fee, tuition, etc.)',
    },
    date: currentOrPastDateUI('Date paid'),
    paidTo: {
      'ui:title': 'Paid to (name or doctor, hospital, etc)',
    }
  }
};
