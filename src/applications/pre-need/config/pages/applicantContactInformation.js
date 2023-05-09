import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';

import * as address from '../../definitions/address';

import { contactInfoDescription } from '../../utils/helpers';

const { claimant } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
  application: {
    claimant: {
      address: address.uiSchema('Applicant’s mailing address'),
      'view:contactInfoDescription': {
        'ui:description': contactInfoDescription,
      },
      phoneNumber: phoneUI('Primary telephone number'),
      email: emailUI(),
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        claimant: {
          type: 'object',
          required: ['email', 'phoneNumber'],
          properties: {
            address: address.schema(fullSchemaPreNeed, true),
            'view:contactInfoDescription': {
              type: 'object',
              properties: {},
            },
            phoneNumber: claimant.properties.phoneNumber,
            email: claimant.properties.email,
          },
        },
      },
    },
  },
};
