import { PRIMARY_PHONE } from '../constants';

const primaryPhone = {
  uiSchema: {},
  schema: {
    type: 'object',
    properties: {
      [PRIMARY_PHONE]: {
        type: 'string',
      },
    },
  },
};

export default primaryPhone;
