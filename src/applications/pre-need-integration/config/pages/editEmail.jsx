import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';
import emailUI from '../../definitions/email';

const { claimant } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
  'ui:description': 'Please update your email address.',
  application: {
    claimant: {
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
          required: ['email'],
          properties: {
            email: claimant.properties.email,
          },
        },
      },
    },
  },
};
