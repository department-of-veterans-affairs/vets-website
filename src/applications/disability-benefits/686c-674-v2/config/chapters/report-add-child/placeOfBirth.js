import { arrayBuilderItemSubsequentPageTitleUI } from 'platform/forms-system/src/js/web-component-patterns';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import {
  customLocationSchemaStatePostal,
  generateHelpText,
} from '../../helpers';

export const placeOfBirth = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Where was this child born?'),
    birthLocation: {
      'ui:title': 'Where was this child born?',
      'ui:options': {
        labelHeaderLevel: '4',
      },
      outsideUsa: {
        'ui:title': 'They were born outside the U.S.',
        'ui:webComponentField': VaCheckboxField,
      },
      location: {
        state: {
          'ui:title': 'State',
          'ui:webComponentField': VaSelectField,
          'ui:required': formData => {
            return formData?.birthLocation?.outsideUsa;
          },
          'ui:errorMessages': {
            required: 'Select a state',
          },
          'ui:options': {
            hideIf: formData => {
              return formData?.birthLocation?.outsideUsa;
            },
          },
        },
        postalCode: {
          'ui:title': 'Postal Code',
          'ui:webComponentField': VaTextInputField,
          'ui:required': formData => {
            return !formData?.birthLocation?.outsideUsa;
          },
          'ui:errorMessages': {
            required: 'Enter a postal code',
          },
        },
      },
    },
    'view:note': {
      'ui:description': generateHelpText(
        'Based on your answers, you’ll need to submit a copy of [Child name’s] birth certificate to add them as your dependent. We’ll ask you to submit this document at the end of this form.',
      ),
      'ui:options': {
        hideIf: (formData, _index) => {
          return !formData?.birthLocation?.outsideUsa;
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      birthLocation: customLocationSchemaStatePostal,
      'view:note': {
        type: 'object',
        properties: {},
      },
    },
  },
};
