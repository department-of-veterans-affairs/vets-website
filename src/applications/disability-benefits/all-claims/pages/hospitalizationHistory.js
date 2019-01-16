import HospitalizationPeriodView from '../components/HospitalizationPeriodView';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import {
  unemployabilityTitle,
  unemployabilityPageTitle,
} from '../content/unemployabilityFormIntro';
import {
  recordsDescription,
  datesDescription,
} from '../content/hospitalizationHistory';
import { generateAddressSchemas } from '../utils';

const {
  hospitalProvidedCare,
} = fullSchema.properties.form8940.properties.unemployability.properties;

const { addressUI, addressSchema } = generateAddressSchemas(
  ['addressLine3', 'postalCode'],
  ['country', 'addressLine1', 'addressLine2', 'city', 'state', 'zipCode'],
  {
    country: 'Country',
    addressLine1: 'Street address',
    addressLine2: 'Street address (optional)',
    city: 'City',
    state: 'State',
    zipCode: 'ZIP',
  },
);

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
          'ui:title': 'Name of hospital',
        },
        address: addressUI,
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
        hospitalProvidedCare: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              ...hospitalProvidedCare.items.properties,
              address: addressSchema,
            },
          },
        },
        'view:recordsInfo': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
