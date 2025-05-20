import { validateTopLevelDomain } from '../validation';

export function validateEmail(errors, pageData) {
  const email = pageData;
  // Allow letters, numbers, _, ., +, -, and @
  const validCharacters = /^[a-zA-Z0-9_.+\-@]+$/;
  if (!validCharacters.test(email)) {
    errors.addError(
      'You entered a character we can’t accept. Try removing spaces and any special characters like commas or brackets.',
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
