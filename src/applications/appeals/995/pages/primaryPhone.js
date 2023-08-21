import { PRIMARY_PHONE, PRIMARY_PHONE_TYPES } from '../constants';

const primaryPhone = {
  uiSchema: {},
  schema: {
    type: 'object',
    required: [PRIMARY_PHONE],
    properties: {
      [PRIMARY_PHONE]: {
        type: 'string',
        enum: PRIMARY_PHONE_TYPES,
      },
    },
  },
};

export default primaryPhone;
