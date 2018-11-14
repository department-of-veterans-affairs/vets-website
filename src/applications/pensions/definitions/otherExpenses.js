import currentOrPastDateUI from 'us-forms-system/lib/js/definitions/currentOrPastDate';
import ExpenseField from '../components/ExpenseField';
import currencyUI from 'us-forms-system/lib/js/definitions/currency';

export default {
  'ui:options': {
    viewField: ExpenseField,
    itemName: 'Expense',
    keepInPageOnReview: true,
  },
  items: {
    'ui:order': ['amount', 'purpose', 'date', 'paidTo'],
    amount: currencyUI('Amount paid'),
    purpose: {
      'ui:title':
        'Purpose (doctor fee, hospital charge, attorney fee, tuition, etc.)',
    },
    date: currentOrPastDateUI('Date paid'),
    paidTo: {
      'ui:title': 'Paid to (name or doctor, hospital, etc)',
    },
  },
};
