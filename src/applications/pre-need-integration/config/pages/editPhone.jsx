import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';
import phoneUI from '../../components/Phone';

const { claimant } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
  'ui:description': 'Please update your phone number.',
  application: {
    claimant: {
      phoneNumber: phoneUI('Phone number'),
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
          required: ['phoneNumber'],
          properties: {
            phoneNumber: claimant.properties.phoneNumber,
          },
        },
      },
    },
  },
};
