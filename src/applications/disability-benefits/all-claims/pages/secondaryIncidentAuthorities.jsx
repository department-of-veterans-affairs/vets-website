import React from 'react';
import { merge } from 'lodash';

import fullSchema from '../config/schema';
import AuthorityField from '../components/AuthorityField';
import { PtsdNameTitle } from '../content/ptsdClassification';
import { PtsdAssaultAuthoritiesDescription } from '../content/ptsdAssaultAuthorities';
import { uiSchema as addressUI } from '../../../../platform/forms/definitions/address';

const { address } = fullSchema.definitions;

export const uiSchema = index => ({
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781a" />
  ),
  'ui:description': PtsdAssaultAuthoritiesDescription,
  [`incident${index}`]: {
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
          street2: {
            'ui:title': 'Street 2',
          },
          state: {
            'ui:title': 'State',
          },
          postalCode: {
            'ui:title': 'Postal Code',
          },
        }),
      },
    },
  },
});

export const schema = index => ({
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
                type: 'object',
                required: [],
                properties: {
                  street: {
                    type: 'string',
                  },
                  street2: {
                    type: 'string',
                  },
                  city: {
                    type: 'string',
                  },
                  postalCode: {
                    type: 'string',
                  },
                  country: {
                    type: 'string',
                    enum: address.properties.country.enum,
                    default: 'USA',
                  },
                  state: {
                    type: 'string',
                    enum: address.properties.state.enum,
                    enumNames: address.properties.state.enumNames,
                  },
                },
              },
            },
          },
        },
      },
    },
  },
});
