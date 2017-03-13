import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import EmploymentPeriodView from '../../../edu-benefits/components/EmploymentPeriodView';

export const schema = commonDefinitions.nonMilitaryJobs;

export const uiSchema = {
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
    hideTitle: true,
    expandUnder: 'view:hasNonMilitaryJobs'
  }
};
