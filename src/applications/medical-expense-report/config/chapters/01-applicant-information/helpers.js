import {
  validateNameSymbols,
  validateEmpty,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  VaTextInputField,
  VaSelectField,
} from 'platform/forms-system/src/js/web-component-fields';

export const conditionalVeteranNameUI = (formatTitle, uiOptions = {}) => {
  return {
    'ui:validations': [validateEmpty],
    first: {
      'ui:title': formatTitle ? formatTitle('first name') : 'First name',
      'ui:autocomplete': 'given-name',
      'ui:webComponentField': VaTextInputField,
      'ui:validations': [validateNameSymbols],
      'ui:errorMessages': {
        required: 'Please enter a first name',
      },
      'ui:required': formData => formData?.claimantNotVeteran === true,
      'ui:options': {
        uswds: true,
        hideIf: formData => formData.claimantNotVeteran === false,
        ...uiOptions,
      },
    },
    middle: {
      'ui:title': formatTitle ? formatTitle('middle name') : 'Middle name',
      'ui:webComponentField': VaTextInputField,
      'ui:autocomplete': 'additional-name',
      'ui:validations': [validateNameSymbols],
      'ui:options': {
        uswds: true,
        hideIf: formData => formData.claimantNotVeteran === false,
        ...uiOptions,
      },
    },
    last: {
      'ui:title': formatTitle ? formatTitle('last name') : 'Last name',
      'ui:autocomplete': 'family-name',
      'ui:webComponentField': VaTextInputField,
      'ui:validations': [validateNameSymbols],
      'ui:errorMessages': {
        required: 'Please enter a last name',
      },
      'ui:required': formData => formData?.claimantNotVeteran === true,
      'ui:options': {
        uswds: true,
        hideIf: formData => formData.claimantNotVeteran === false,
        ...uiOptions,
      },
    },
    suffix: {
      'ui:title': formatTitle ? formatTitle('suffix') : 'Suffix',
      'ui:autocomplete': 'honorific-suffix',
      'ui:webComponentField': VaSelectField,
      'ui:options': {
        widgetClassNames: 'form-select-medium',
        uswds: true,
        hideIf: formData => formData.claimantNotVeteran === false,
        ...uiOptions,
      },
    },
  };
};
