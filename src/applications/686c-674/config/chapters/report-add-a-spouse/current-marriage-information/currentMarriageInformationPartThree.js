import { titleUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import VaTextInputField from '@department-of-veterans-affairs/platform-forms-system/web-component-fields/VaTextInputField';
import VaSelectField from '@department-of-veterans-affairs/platform-forms-system/web-component-fields/VaSelectField';
import VaCheckboxField from '@department-of-veterans-affairs/platform-forms-system/web-component-fields/VaCheckboxField';
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
