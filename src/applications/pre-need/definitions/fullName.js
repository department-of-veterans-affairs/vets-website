import { validateWhiteSpace } from 'platform/forms/validations';
import environment from 'platform/utilities/environment';

export function validateName(errors, pageData) {
  const { first, last } = pageData;
  validateWhiteSpace(errors.first, first);
  validateWhiteSpace(errors.last, last);
}

const uiSchema = {
  'ui:validations': [validateName],
  first: {
    'ui:title': 'Deceased’s first name',
    'ui:autocomplete': 'given-name',
    'ui:errorMessages': {
      required: 'Please enter a first name',
    },
  },
  last: {
    'ui:title': 'Deceased’s last name',
    'ui:autocomplete': 'family-name',
    'ui:errorMessages': {
      required: 'Please enter a last name',
    },
  },
  middle: {
    'ui:title': 'Deceased’s middle name ',
    'ui:autocomplete': 'additional-name',
    'ui:options': {
      hideIf: () => !environment.isProduction(),
    },
  },
  suffix: {
    'ui:title': 'Deceased’s suffix',
    'ui:autocomplete': 'honorific-suffix',
    'ui:options': {
      hideIf: () => !environment.isProduction(),
    },
  },
};

export default uiSchema;
