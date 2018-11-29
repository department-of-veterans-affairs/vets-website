import { merge, omit } from 'lodash';

import fullSchema from '../config/schema';
import AuthorityField from '../components/AuthorityField';
import { ptsd781aNameTitle } from '../content/ptsdClassification';
import { PtsdAssaultAuthoritiesDescription } from '../content/ptsdAssaultAuthorities';
import {
  uiSchema as addressUI,
  schema as addressSchema,
} from '../../../../platform/forms/definitions/address';
import { validateZIP } from '../validations';

export const uiSchema = index => ({
  'ui:title': ptsd781aNameTitle,
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
              },
            },
          },
        },
      },
    },
  };
};
