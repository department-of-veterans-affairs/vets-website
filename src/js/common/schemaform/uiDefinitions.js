import { validateSSN } from './validation';

export const uiFullName = {
  first: {
    'ui:title': 'First name'
  },
  last: {
    'ui:title': 'Last name'
  },
  middle: {
    'ui:title': 'Middle name'
  },
  suffix: {
    'ui:title': 'Suffix',
    'ui:options': {
      widgetClassNames: 'form-select-medium'
    }
  }
};

export const uiSSN = {
  'ui:title': 'Social security number',
  'ui:options': {
    widgetClassNames: 'usa-input-medium'
  },
  'ui:validations': [
    validateSSN
  ]
};
