import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import VaTextInputField from '../web-component-fields/VaTextInputField';

/**
 * Web component uiSchema for email
 * ```js
 * email: emailUI() // 'Email address'
 * email: emailUI('Your email address')
 * email: emailUI('Your email address', true)
 * ```
 * @param {string} [title] - optional title to override default 'Email address'
 * @param {boolean} [showAllowCorrespondence] - optional boolean to show allow correspondence checkbox
 * @returns {UISchemaOptions} uiSchema
 */
const emailUI = (title, showAllowCorrespondence = false) => {
  return {
    'ui:title': title ?? 'Email address',
    'ui:autocomplete': 'email',
    'ui:description': showAllowCorrespondence
      ? 'By providing an email address, I agree to receive electronic correspondence from VA regarding my application'
      : '',
    'ui:webComponentField': VaTextInputField,
    'ui:errorMessages': {
      required: 'Please enter an email address',
      format:
        'Enter a valid email address using the format email@domain.com. Your email address can only have letters, numbers, the @ symbol and a period, with no spaces.',
      pattern:
        'Enter a valid email address using the format email@domain.com. Your email address can only have letters, numbers, the @ symbol and a period, with no spaces.',
    },
    'ui:options': {
      inputType: 'email',
      uswds: true,
      labels: {
        yes: 'Yes',
        no: 'No',
      },
    },
  };
};

/**
 * @returns `commonDefinitions.email`;
 */
const emailSchema = commonDefinitions.email;

export { emailUI, emailSchema };
