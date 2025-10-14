import { validateWhiteSpace } from 'platform/forms/validations';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

export function validateName(errors, pageData) {
  const { first, last } = pageData;
  validateWhiteSpace(errors.first, first);
  validateWhiteSpace(errors.last, last);
}

const uiSchema = {
  'ui:validations': [validateName],
  first: {
    'ui:title': 'Deceased’s first name',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'given-name',
    'ui:errorMessages': {
      required: 'Please enter a first name',
    },
  },
  last: {
    'ui:title': 'Deceased’s last name',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'family-name',
    'ui:errorMessages': {
      required: 'Please enter a last name',
    },
  },
  middle: {
    'ui:title': 'Deceased’s middle name ',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'additional-name',
    'ui:options': {
      hideIf: () => true,
    },
  },
  suffix: {
    'ui:title': 'Deceased’s suffix',
    'ui:autocomplete': 'honorific-suffix',
    'ui:options': {
      hideIf: () => true,
    },
  },
};

export default uiSchema;
