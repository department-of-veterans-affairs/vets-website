import {
  titleUI,
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Mailing address'),
    claimantAddress: addressUI(),
  },
  schema: {
    type: 'object',
    required: ['claimantAddress'],
    properties: {
      claimantAddress: addressSchema(),
    },
  },
};
