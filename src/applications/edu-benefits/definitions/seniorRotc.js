import yearUI from '@department-of-veterans-affairs/platform-forms-system/year';
import currencyUI from '@department-of-veterans-affairs/platform-forms-system/currency';
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
