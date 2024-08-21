import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import { customLocationSchema } from '../../../helpers';
import { FormerSpouseHeader } from '../../../../components/SpouseViewField';

export const schema = {
  type: 'object',
  properties: {
    veteranMarriageHistory: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'object',
        properties: {
          startLocation: customLocationSchema,
        },
      },
    },
  },
};

export const uiSchema = {
  veteranMarriageHistory: {
    items: {
      'ui:title': FormerSpouseHeader,
      startLocation: {
        outsideUsa: {
          'ui:title': 'I got married outside the U.S.',
          'ui:webComponentField': VaCheckboxField,
        },
        location: {
          city: {
            'ui:title': 'City',
            'ui:required': () => true,
            'ui:autocomplete': 'address-level2',
            'ui:errorMessages': {
              required: 'Enter the city where you were married',
            },
            'ui:webComponentField': VaTextInputField,
          },
          state: {
            'ui:title': 'State',
            'ui:webComponentField': VaSelectField,
            'ui:required': (formData, index) =>
              !formData?.veteranMarriageHistory[`${index}`]?.startLocation
                ?.outsideUsa,
            'ui:errorMessages': {
              required: 'Select a state',
            },
            'ui:options': {
              hideIf: (formData, index) =>
                formData?.veteranMarriageHistory[`${index}`]?.startLocation
                  ?.outsideUsa,
            },
          },
        },
      },
    },
  },
};
