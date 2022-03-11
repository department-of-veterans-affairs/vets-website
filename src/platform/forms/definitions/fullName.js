import { validateWhiteSpace } from '../validations';

export function validateName(errors, pageData) {
  const { first, last } = pageData;
  validateWhiteSpace(errors.first, first);
  validateWhiteSpace(errors.last, last);
}

const uiSchema = {
  'ui:validations': [validateName],
  first: {
    'ui:title': 'Your first name',
    'ui:autocomplete': 'given-name',
    'ui:errorMessages': {
      required: 'Please enter a first name',
    },
  },
  last: {
    'ui:title': 'Your last name',
    'ui:autocomplete': 'family-name',
    'ui:errorMessages': {
      required: 'Please enter a last name',
    },
  },
  middle: {
    'ui:title': 'Your middle name',
    'ui:autocomplete': 'additional-name',
  },
  suffix: {
    'ui:title': 'Suffix',
    'ui:autocomplete': 'honorific-suffix',
    'ui:options': {
      widgetClassNames: 'form-select-medium',
    },
  },
};

export default uiSchema;
