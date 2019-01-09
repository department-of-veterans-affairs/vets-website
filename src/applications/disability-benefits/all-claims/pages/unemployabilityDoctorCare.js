import { unemployabilityTitle } from '../content/unemployabilityFormIntro';
import { merge, omit } from 'lodash';
import fullSchema from '../config/schema';
import {
  uiSchema as addressUI,
  schema as addressSchema,
} from '../../../../platform/forms/definitions/address';

import { validateZIP } from '../validations';
import UnemployabilityDoctorCareField from '../components/UnemployabilityDoctorCareField';
import {
  doctorDatesDecription,
  doctorCareDescription,
  privateMedicalFacilityDescription,
  doctorCareTitle,
} from '../content/unemployabilityDoctorCare';

const address = addressSchema(fullSchema);

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  unemployability: {
    'ui:title': doctorCareTitle,
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
        address: merge(addressUI('', false), {
          'ui:order': [
            'country',
            'addressLine1',
            'addressLine2',
            'city',
            'state',
            'zipCode',
          ],
          addressLine1: {
            'ui:title': 'Street address',
          },
          addressLine2: {
            'ui:title': 'Street address (line 2)',
          },
          state: {
            'ui:title': 'State',
          },
          zipCode: {
            'ui:title': 'Postal Code',
            'ui:validations': [validateZIP],
          },
        }),
        dates: {
          'ui:title': doctorDatesDecription,
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
              name: {
                type: 'string',
              },
              address: {
                ...address,
                properties: {
                  ...omit(address.properties, ['addressLine3', 'postalCode']),
                  zipCode: {
                    type: 'string',
                  },
                },
              },
              dates: {
                type: 'string',
              },
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
