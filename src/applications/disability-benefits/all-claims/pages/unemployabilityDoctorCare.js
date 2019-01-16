import {
  unemployabilityTitle,
  unemployabilityPageTitle,
} from '../content/unemployabilityFormIntro';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

import UnemployabilityDoctorCareField from '../components/UnemployabilityDoctorCareField';
import {
  doctorDatesDecription,
  doctorCareDescription,
  privateMedicalFacilityDescription,
} from '../content/unemployabilityDoctorCare';
import { generateAddressSchemas } from '../utils';

const {
  doctorProvidedCare,
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
    zipCode: 'Postal Code',
  },
);

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  unemployability: {
    'ui:title': unemployabilityPageTitle('Doctor’s care'),
    'ui:description': doctorCareDescription,
    doctorProvidedCare: {
      'ui:options': {
        viewField: UnemployabilityDoctorCareField,
        itemName: 'Doctor',
      },
      items: {
        name: {
          'ui:title': 'Doctor’s name',
        },
        address: addressUI,
        dates: {
          'ui:title': ' ',
          'ui:description': doctorDatesDecription,
          'ui:widget': 'textarea',
          'ui:options': {
            rows: 5,
            maxLength: 32000,
          },
        },
      },
    },
  },
  'view:privateMedicalFacility': {
    'ui:title': ' ',
    'ui:description': privateMedicalFacilityDescription,
  },
};

export const schema = {
  type: 'object',
  properties: {
    unemployability: {
      type: 'object',
      properties: {
        doctorProvidedCare: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              ...doctorProvidedCare.items.properties,
              address: addressSchema,
            },
          },
        },
      },
    },
    'view:privateMedicalFacility': {
      type: 'object',
      properties: {},
    },
  },
};
