import { militaryNameUI } from '../../utils/helpers';

export const uiSchema = militaryNameUI;
export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        veteran: {
          type: 'object',
          required: ['view:hasServiceName'],
          properties: {
            'view:hasServiceName': {
              type: 'boolean',
            },
          },
        },
      },
    },
  },
};
