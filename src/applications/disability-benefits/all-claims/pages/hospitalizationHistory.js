import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';

import HospitalizationPeriodView from '../components/HospitalizationPeriodView';

import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import { unemployabilityTitle } from '../content/unemployabilityFormIntro';

const { hospitalProvidedCare } = fullSchema.properties.form8940;

export const uiSchema = {
  unemployability: {
    'ui:title': unemployabilityTitle,
    hospitalProvidedCare: {
      'ui:title': 'Hospitalization',
      'ui:description': 'Dates you were hospitalized?',
      'ui:options': {
        itemName: 'Hospital',
        viewField: HospitalizationPeriodView,
        hideTitle: true,
      },
      items: {
        name: {
          'ui:title': 'Name of hospital',
        },
        address: {
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
        dates: dateRangeUI(
          'From',
          'To',
          'End of hospitalization must be after start of treatment',
        ),
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
        hospitalProvidedCare,
      },
    },
  },
};
