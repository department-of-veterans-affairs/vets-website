import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

import { validateTopLevelDomain } from '../validation';

export function validateEmail(errors, pageData) {
  const email = pageData;
  const validCharacters = /^[a-zA-Z0-9_.%+@-]+$/;
  if (!validCharacters.test(email)) {
    errors.addError(
      'Enter a valid email address using the format email@domain.com.',
    );
  }
  validateTopLevelDomain(errors, email);
}

/*
 * Email uiSchema
 *
 * @param {string} title - The field label, defaults to "Email address"
 */

export default function uiSchema(title = 'Email address') {
  return {
    'ui:title': title,
    'ui:webComponentField': VaTextInputField,
    'ui:validations': [validateEmail],
    'ui:errorMessages': {
      format: 'Enter a valid email address using the format email@domain.com.',
      required: 'Please enter an email address',
    },
    'ui:autocomplete': 'email',
    'ui:options': {
      inputType: 'email',
    },
  };
}
