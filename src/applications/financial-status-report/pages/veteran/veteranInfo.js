import VeteranInfoBox from '../../components/shared/VeteranInfoBox';

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
              type: 'string',
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
