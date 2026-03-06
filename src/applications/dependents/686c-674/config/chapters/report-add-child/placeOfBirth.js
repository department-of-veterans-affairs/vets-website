import { arrayBuilderItemSubsequentPageTitleUI } from 'platform/forms-system/src/js/web-component-patterns';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import {
  customLocationSchemaStatePostal,
  generateHelpText,
  asciiValidation,
} from '../../helpers';

export const placeOfBirth = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${formData?.fullName?.first || 'Child'}\u2019s birth place`,
      null,
      false,
    ),
    birthLocation: {
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
            required: 'Enter the city where the child was born',
          },
          'ui:webComponentField': VaTextInputField,
          'ui:validations': [
            (errors, city) => {
              if (city?.length > 30) {
                errors.addError('City must be 30 characters or less');
              }
            },
            asciiValidation,
          ],
        },
        state: {
          'ui:title': 'State',
          'ui:webComponentField': VaSelectField,
          'ui:errorMessages': {
            required: 'Select a state',
          },
          'ui:options': {
            hideIf: (formData, index) =>
              formData?.childrenToAdd?.[index]?.birthLocation?.outsideUsa ||
              formData?.birthLocation?.outsideUsa,
          },
          'ui:required': (formData, index) =>
            !(
              formData?.childrenToAdd?.[index]?.birthLocation?.outsideUsa ||
              formData?.birthLocation?.outsideUsa
            ),
        },
        country: {
          'ui:title': 'Country',
          'ui:webComponentField': VaSelectField,
          'ui:errorMessages': {
            required: 'Select a country',
          },
          'ui:options': {
            hideIf: (formData, index) =>
              !(
                formData?.childrenToAdd?.[index]?.birthLocation?.outsideUsa ||
                formData?.birthLocation?.outsideUsa
              ),
          },
          'ui:required': (formData, index) =>
            formData?.childrenToAdd?.[index]?.birthLocation?.outsideUsa ||
            formData?.birthLocation?.outsideUsa,
        },
        postalCode: {
          'ui:title': 'Postal Code',
          'ui:webComponentField': VaTextInputField,
          'ui:errorMessages': {
            required: 'Enter a postal code',
            pattern: 'Enter a valid 5-digit postal code',
          },
          'ui:required': (formData, index) =>
            !(
              formData?.childrenToAdd?.[index]?.birthLocation?.outsideUsa ||
              formData?.birthLocation?.outsideUsa
            ),
        },
      },
    },
    'view:note': {
      'ui:description': generateHelpText(
        'Based on your answers, you\u2019ll need to submit a copy of this child\u2019s birth certificate to add them as your dependent. We\u2019ll ask you to submit this document at the end of this form.',
      ),
      'ui:options': {
        hideIf: (_formData, _index, fullFormData) =>
          !(
            fullFormData?.veteranContactInformation?.veteranAddress?.country !==
              'USA' ||
            fullFormData?.veteranContactInformation?.veteranAddress?.isMilitary
          ),
      },
    },
  },
  schema: {
    type: 'object',
    required: ['birthLocation'],
    properties: {
      birthLocation: customLocationSchemaStatePostal,
      'view:note': {
        type: 'object',
        properties: {},
      },
    },
  },
};
