import React from 'react';

import { PtsdNameTitle } from '../content/ptsdClassification';
import {
  PtsdAssaultAuthoritiesDescription,
  AuthorityField,
} from '../content/ptsdAssaultAuthorities';

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
        // 'ui:description': recordReleaseDescription,
        // 'ui:title': 'Test Title',
        // 'view:limitedConsent': {
        //   'ui:title': limitedConsentTitle,
        // },
        name: {
          'ui:title': 'Name of authority',
        },
      },
    },
  },
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`incident${index}`]: {
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
            },
          },
        },
      },
    },
  },
});
