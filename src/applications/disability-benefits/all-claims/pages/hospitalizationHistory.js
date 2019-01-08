import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';

import HospitalizationPeriodView from '../components/HospitalizationPeriodView';

import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import { unemployabilityTitle } from '../content/unemployabilityFormIntro';

const { hospitalizationHistory } = fullSchema.properties;

export const uiSchema = {
  unemployability: {
    'ui:title': unemployabilityTitle,
    hospitalizationHistory: {
      'ui:title': 'Hospitalization',
      'ui:description': 'Dates you were hospitalized?',
      'ui:options': {
        itemName: 'Hospital',
        viewField: HospitalizationPeriodView,
        hideTitle: true,
      },
      items: {
        hospitalizationDateRange: dateRangeUI(
          'From',
          'To',
          'End of hospitalization must be after start of treatment',
        ),
        hospitalName: {
          'ui:title': 'Name of hospital',
        },
        hospitalAddress: {
          addressLine1: {
            'ui:title': 'Street address',
          },
          addressLine2: {
            'ui:title': 'Street address (optional)',
          },
          city: {
            'ui:title': 'City',
          },
          state: {
            'ui:title': 'State',
            'ui:options': {
              widgetClassNames: 'usa-input-medium',
            },
          },
          zipCode: {
            'ui:title': 'ZIP',
            'ui:options': {
              widgetClassNames: 'usa-input-medium',
            },
            'ui:errorMessages': {
              pattern: 'Please provide valid 5 or 9 digit zip code.',
            },
          },
        },
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    unemployability: {
      type: 'object',
      properties: {
        hospitalizationHistory,
      },
    },
  },
};
