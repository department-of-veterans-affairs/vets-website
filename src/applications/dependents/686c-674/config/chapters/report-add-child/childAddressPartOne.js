import {
  addressUI,
  addressSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const childAddressPartOne = {
  uiSchema: {
    ...titleUI({
      title: 'Child’s address',
    }),
    address: {
      ...addressUI(),
    },
    'ui:options': {
      updateSchema: (formData, formSchema, _uiSchema, index) => {
        if (formData?.childrenToAdd?.[index]?.doesChildLiveWithYou === false) {
          return {
            ...formSchema,
            required: ['address'],
          };
        }
        return formSchema;
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      address: addressSchema(),
    },
  },
};
