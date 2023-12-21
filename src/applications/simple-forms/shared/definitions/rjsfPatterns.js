import {
  validateEmpty,
  validateNameSymbols,
} from 'platform/forms-system/src/js/web-component-patterns/fullNamePattern';

// RJSF version of web-component fullNameUI
// Deprecated because web-components are preferred
export const fullNameDeprecatedUI = {
  'ui:validations': [validateEmpty],
  first: {
    'ui:title': 'First name',
    'ui:autocomplete': 'given-name',
    'ui:validations': [validateNameSymbols],
    'ui:errorMessages': {
      required: 'Please enter a first name',
    },
  },
  last: {
    'ui:title': 'Last name',
    'ui:autocomplete': 'family-name',
    'ui:validations': [validateNameSymbols],
    'ui:errorMessages': {
      required: 'Please enter a last name',
    },
  },
  middle: {
    'ui:title': 'Middle name',
    'ui:autocomplete': 'additional-name',
    'ui:validations': [validateNameSymbols],
  },
  suffix: {
    'ui:title': 'Suffix',
    'ui:autocomplete': 'honorific-suffix',
    'ui:options': {
      widgetClassNames: 'form-select-medium',
    },
  },
};
