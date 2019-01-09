import HospitalizationPeriodView from '../components/HospitalizationPeriodView';

import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import { unemployabilityTitle } from '../content/unemployabilityFormIntro';
import { merge } from 'lodash';
import { uiSchema as addressUI } from '../../../../platform/forms/definitions/address';

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
        address: merge(addressUI('', false), {
          'ui:order': [
            'addressLine1',
            'addressLine2',
            'city',
            'state',
            'postalCode',
          ],
          addressLine1: {
            'ui:title': 'Street address',
          },
          addressLine2: {
            'ui:title': 'Street address (optional)',
          },
          state: {
            'ui:title': 'State',
          },
          postalCode: {
            'ui:title': 'ZIP',
          },
        }),
        dates: {
          'ui:title': 'End of hospitalization must be after start of treatment',
          'ui:widget': 'textarea',
          'ui:options': {
            rows: 5,
            maxLength: 32000,
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
        hospitalProvidedCare,
      },
    },
  },
};
