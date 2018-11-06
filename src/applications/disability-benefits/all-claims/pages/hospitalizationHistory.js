import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';

import HospitalizationPeriodView from '../components/HospitalizationPeriodView';

export const uiSchema = {
  hospitalizationHistory: {
    'ui:title': 'Hospitalization',
    'ui:description': 'Dates you were hospitalized?',
    'ui:options': {
      itemName: 'Hospital',
      viewField: HospitalizationPeriodView,
      hideTitle: true,
    },
    items: {
      hospitalizationtDateRange: dateRangeUI(
        'From',
        'To',
        'End of hospitalization must be after start of treatment',
      ),
      hospitalName: {
        'ui:title': 'Name of hospital',
      },
      streetAddress: {
        'ui:title': 'Street address',
      },
      streetAddress2: {
        'ui:title': 'Street address (optional)',
      },
      city: {
        'ui:title': 'City',
      },
      state: {
        'ui:title': 'State',
      },
      zip: {
        'ui:title': 'ZIP',
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    hospitalizationHistory: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          hospitalizationDateRange: {
            type: 'object',
            properties: {
              from: {
                $ref: '#/definitions/date',
              },
              to: {
                $ref: '#/definitions/date',
              },
            },
          },
          hospitalName: {
            type: 'string',
          },
          streetAddress: {
            type: 'string',
          },
          streetAddress2: {
            type: 'string',
          },
          city: {
            type: 'string',
          },
          state: {
            type: 'string',
          },
          zip: {
            type: 'string',
          },
        },
      },
    },
  },
};
