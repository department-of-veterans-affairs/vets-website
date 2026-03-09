import {
  arrayBuilderItemSubsequentPageTitleUI,
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const childAddressPartOne = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) => `${formData?.fullName?.first || 'Child'}’s address`,
      null,
      false,
    ),
    address: {
      ...addressUI({
        title: '',
        omit: ['street3'],
        labels: {
          street2: 'Apartment or unit number',
          militaryCheckbox:
            'This child lives on a United States military base outside of the U.S.',
        },
      }),
      city: {
        ...addressUI().city,
        'ui:validations': [
          (errors, city, formData) => {
            const address = formData?.address;
            const cityStr = city?.trim().toUpperCase();

            if (
              address &&
              ['APO', 'FPO', 'DPO'].includes(cityStr) &&
              address.isMilitary !== true
            ) {
              errors.addError('Enter a valid city name');
            }
          },
        ],
      },
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
      address: addressSchema({ omit: ['street3'] }),
    },
  },
};
