import yearUI from 'us-forms-system/lib/js/definitions/year';
import currencyUI from 'us-forms-system/lib/js/definitions/currency';
import ScholarshipPeriodField from '../components/ScholarshipPeriodField';

export default {
  'ui:title': 'ROTC scholarships',
  'ui:options': {
    itemName: 'Scholarship Period',
    viewField: ScholarshipPeriodField,
  },
  items: {
    year: yearUI,
    amount: currencyUI('Scholarship amount'),
  },
};
