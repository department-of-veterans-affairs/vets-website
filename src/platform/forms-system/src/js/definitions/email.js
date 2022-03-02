/*
 * Email uiSchema
 *
 * @param {string} title - The field label, defaults to "Email address"
 */
export default function uiSchema(title = 'Email address') {
  return {
    'ui:title': title,
    'ui:errorMessages': {
      pattern: 'Please enter an email address using this format: X@X.com',
      required: 'Please enter an email address',
    },
    'ui:autocomplete': 'email',
    'ui:options': {
      inputType: 'email',
    },
  };
}
