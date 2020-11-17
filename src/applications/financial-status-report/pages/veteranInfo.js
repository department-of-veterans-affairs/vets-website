import VeteranInfoBox from '../components/VeteranInfoBox';

export const uiSchema = {
  'view:veteranInfo': {
    'ui:field': VeteranInfoBox,
  },
};

export const schema = {
  title: 'Financial Status Report 5655',
  type: 'object',
  properties: {
    'view:veteranInfo': {
      type: 'object',
      properties: {
        fullName: {
          type: 'string',
        },
        ssnLastFour: {
          type: 'number',
        },
        dob: {
          type: 'string',
        },
        vaFileNumber: {
          type: 'number',
        },
      },
    },
  },
};
