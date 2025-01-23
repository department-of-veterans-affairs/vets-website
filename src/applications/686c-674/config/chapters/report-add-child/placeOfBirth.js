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
          'ui:errorMessages': {
            required: 'Select a state',
          },
          'ui:options': {
            hideIf: formData => formData?.birthLocation?.outsideUsa,
          },
          'ui:required': formData => !formData?.birthLocation?.outsideUsa,
        },
        country: {
          'ui:title': 'Country',
          'ui:webComponentField': VaSelectField,
          'ui:errorMessages': {
            required: 'Select a country',
          },
          'ui:options': {
            hideIf: formData => !formData?.birthLocation?.outsideUsa,
          },
          'ui:required': formData => formData?.birthLocation?.outsideUsa,
        },
        postalCode: {
          'ui:title': 'Postal Code',
          'ui:webComponentField': VaTextInputField,
          'ui:errorMessages': {
            required: 'Enter a postal code',
          },
          'ui:required': formData => !formData?.birthLocation?.outsideUsa,
        },
      },
    },
    'view:note': {
      'ui:description': generateHelpText(
        "Based on your answers, you’ll need to submit a copy of this child's birth certificate to add them as your dependent. We’ll ask you to submit this document at the end of this form.",
      ),
      'ui:options': {
        hideIf: (formData, _index) => {
          const address =
            formData?.veteranContactInformation?.veteranAddress || {};
          const isMilitaryOrUSA =
            address.isMilitary || address.country === 'USA';
          return !isMilitaryOrUSA;
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
