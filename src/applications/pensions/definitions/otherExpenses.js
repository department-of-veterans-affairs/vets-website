import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import ExpenseField from '../components/ExpenseField';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';

export default {
  'ui:options': {
    viewField: ExpenseField,
    itemName: 'Expense',
    keepInPageOnReview: true,
  },
  items: {
    'ui:order': ['amount', 'purpose', 'date', 'paidTo'],
    amount: {
      ...currencyUI('Amount paid'),
      'ui:options': {
        useDlWrap: true,
      },
    },
    purpose: {
      'ui:options': {
        useDlWrap: true,
      },
      'ui:title':
        'Purpose (doctor fee, hospital charge, attorney fee, tuition, etc.)',
    },
    date: {
      ...currentOrPastDateUI('Date paid'),
      'ui:options': {
        useDlWrap: true,
      },
    },
    paidTo: {
      'ui:options': {
        useDlWrap: true,
      },
      'ui:title': 'Paid to (name or doctor, hospital, etc)',
    },
  },
};
