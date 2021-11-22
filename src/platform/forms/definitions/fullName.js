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
    'ui:errorMessages': {
      required: 'Please enter a first name',
    },
  },
  last: {
    'ui:title': 'Your last name',
    'ui:errorMessages': {
      required: 'Please enter a last name',
    },
  },
  middle: {
    'ui:title': 'Your middle name',
  },
  suffix: {
    'ui:title': 'Suffix',
    'ui:options': {
      widgetClassNames: 'form-select-medium',
    },
  },
};

export default uiSchema;
