import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import { customLocationSchema } from '../../../helpers';

export const schema = {
  type: 'object',
  properties: {
    currentMarriageInformation: customLocationSchema,
  },
};

export const uiSchema = {
  currentMarriageInformation: {
    ...titleUI('Where did you get married?'),
    outsideUsa: {
      'ui:title': 'This occurred outside the U.S.',
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
        'ui:errorMessages': {
          required: 'Select a state',
        },
        'ui:required': formData =>
          !formData?.currentMarriageInformation?.outsideUsa,
        'ui:options': {
          hideIf: formData => formData?.currentMarriageInformation?.outsideUsa,
        },
      },
      country: {
        'ui:title': 'Country',
        'ui:webComponentField': VaSelectField,
        'ui:errorMessages': {
          required: 'Select a country',
        },
        'ui:required': formData =>
          formData?.currentMarriageInformation?.outsideUsa,
        'ui:options': {
          hideIf: formData => !formData?.currentMarriageInformation?.outsideUsa,
        },
      },
    },
  },
};
