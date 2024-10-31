import yearUI from 'platform/forms-system/src/js/definitions/year';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';

export default {
  'ui:title': 'ROTC scholarships',
  'ui:options': {
    itemName: 'Scholarship Period',
  },
  items: {
    year: yearUI,
    amount: currencyUI('Scholarship amount'),
  },
};
