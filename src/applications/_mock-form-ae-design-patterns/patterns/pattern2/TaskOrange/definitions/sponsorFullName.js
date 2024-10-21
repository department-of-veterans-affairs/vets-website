import { validateWhiteSpace } from 'platform/forms/validations';

export function validateName(errors, pageData) {
  const { first, last } = pageData;
  validateWhiteSpace(errors.first, first);
  validateWhiteSpace(errors.last, last);
}

const uiSchema = {
  'ui:validations': [validateName],
  first: {
    'ui:title': "Sponsor's first name",
    'ui:errorMessages': {
      required: 'Please enter a first name',
    },
  },
  last: {
    'ui:title': "Sponsor's last name",
    'ui:errorMessages': {
      required: 'Please enter a last name',
    },
  },
  middle: {
    'ui:title': "Sponsor's middle name",
  },
  suffix: {
    'ui:title': "Sponsor's suffix",
    'ui:options': {
      widgetClassNames: 'form-select-medium',
    },
  },
};

export default uiSchema;
