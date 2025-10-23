import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

import HospitalizationPeriodView from '../components/HospitalizationPeriodView';
import {
  unemployabilityTitle,
  unemployabilityPageTitle,
} from '../content/unemployabilityFormIntro';
import {
  recordsDescription,
  datesDescription,
} from '../content/hospitalizationHistory';
import { addressUISchema } from '../utils/schemas';

const {
  hospitalProvidedCare,
} = fullSchema.properties.form8940.properties.unemployability.properties;

export const uiSchema = {
  unemployability: {
    'ui:title': unemployabilityTitle,
    hospitalProvidedCare: {
      'ui:title': unemployabilityPageTitle('Hospitalization'),
      'ui:options': {
        itemName: 'Hospital',
        viewField: HospitalizationPeriodView,
        hideTitle: true,
      },
      items: {
        name: {
          'ui:title': 'Hospital’s name',
        },
        'view:hospitalAddressTitle': {
          'ui:title': 'Hospital’s address',
        },
        address: addressUISchema(
          'unemployability.hospitalProvidedCare[:index].address',
          null,
          false,
          false,
        ),
        dates: {
          'ui:title': datesDescription,
          'ui:widget': 'textarea',
          'ui:options': {
            rows: 5,
            maxLength: 32000,
          },
        },
      },
    },
    'view:recordsInfo': {
      'ui:title': ' ',
      'ui:description': recordsDescription,
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
        'view:recordsInfo': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
