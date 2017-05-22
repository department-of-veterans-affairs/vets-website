import EmploymentPeriodView from '../../../edu-benefits/components/EmploymentPeriodView';

const uiSchema = {
  items: {
    name: {
      'ui:title': 'Main job'
    },
    months: {
      'ui:title': 'Number of months worked'
    },
    licenseOrRating: {
      'ui:title': 'Licenses or rating'
    }
  },
  'ui:options': {
    itemName: 'Employment Period',
    viewField: EmploymentPeriodView,
    hideTitle: true
  }
};

export default uiSchema;
