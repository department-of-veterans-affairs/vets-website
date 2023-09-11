import { PRIMARY_PHONE, PRIMARY_PHONE_TYPES } from '../../995/constants';

const primaryPhone = {
  uiSchema: {},
  schema: {
    type: 'object',
    properties: {
      [PRIMARY_PHONE]: {
        type: 'string',
        enum: PRIMARY_PHONE_TYPES,
      },
    },
  },
};

export default primaryPhone;
