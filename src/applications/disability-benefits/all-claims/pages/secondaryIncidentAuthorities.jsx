import React from 'react';
import { merge, omit } from 'lodash';

import fullSchema from '../config/schema';
import AuthorityField from '../components/AuthorityField';
import { PtsdNameTitle } from '../content/ptsdClassification';
import { PtsdAssaultAuthoritiesDescription } from '../content/ptsdAssaultAuthorities';
import { isValidPhone } from '../../../../platform/forms/validations';
import {
  uiSchema as addressUI,
  schema as addressSchema,
} from '../../../../platform/forms/definitions/address';
import { validateZIP } from '../validations';

const validatePhone = (errors, phone) => {
  if (!isValidPhone(phone)) {
    errors.addError('Phone numbers must be 10 digits (dashes allowed)');
  }
};

export const uiSchema = index => ({
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781a" />
  ),
  'ui:description': PtsdAssaultAuthoritiesDescription,
  [`secondaryIncident${index}`]: {
    authorities: {
      'ui:options': {
        itemName: 'Authority',
        viewField: AuthorityField,
      },
      items: {
        name: {
          'ui:title': 'Name of authority',
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
            'ui:title': 'Street',
          },
          addressLine2: {
            'ui:title': 'Street 2',
          },
          state: {
            'ui:title': 'State',
          },
          zipCode: {
            'ui:title': 'Postal Code',
            'ui:validations': [validateZIP],
          },
        }),
        phone: {
          'ui:title': 'Primary phone number',
          'ui:validations': [validatePhone],
        },
      },
    },
  },
});

export const schema = index => {
  const address = addressSchema(fullSchema);

  return {
    type: 'object',
    properties: {
      [`secondaryIncident${index}`]: {
        type: 'object',
        properties: {
          authorities: {
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
                phone: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  };
};
