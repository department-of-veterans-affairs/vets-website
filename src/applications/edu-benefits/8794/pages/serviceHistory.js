// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

// Example of an imported schema:
// import fullSchema from '../22-8794-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/22-8794-schema.json';

import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import ServicePeriodView from 'platform/forms/components/ServicePeriodView';

const { toursOfDuty } = commonDefinitions;

export default {
  uiSchema: {
    toursOfDuty: {
      'ui:title': 'Service periods',
      'ui:options': {
        itemName: 'Service Period',
        viewField: ServicePeriodView,
        hideTitle: true,
      },
      items: {
        dateRange: dateRangeUI(
          'Service start date',
          'Service end date',
          'End of service must be after start of service',
        ),
        serviceBranch: {
          'ui:title': 'Branch of service',
        },
        serviceStatus: {
          'ui:title':
            'Type of service (Active duty, drilling reservist, IRR, etc.)',
        },
        applyPeriodToSelected: {
          'ui:title':
            'Apply this service period to the benefit I’m applying for.',
          'ui:options': {
            hideOnReviewIfFalse: true,
          },
        },
        benefitsToApplyTo: {
          'ui:title':
            'Please explain how you’d like this service period applied.',
          'ui:widget': 'textarea',
          'ui:options': {
            expandUnder: 'applyPeriodToSelected',
            expandUnderCondition: false,
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      toursOfDuty,
    },
  },
};
