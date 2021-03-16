import VeteranInfoBox from '../../components/VeteranInfoBox';

export const uiSchema = {
  'view:components': {
    'view:veteranInfo': {
      'ui:field': VeteranInfoBox,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:components': {
      type: 'object',
      properties: {
        'view:veteranInfo': {
          type: 'object',
          properties: {
            veteranFullName: {
              type: 'string',
            },
            ssnLastFour: {
              type: 'number',
            },
            dob: {
              type: 'string',
            },
            fileNumber: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};
