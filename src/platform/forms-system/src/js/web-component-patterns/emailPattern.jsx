import { isValidEmail } from 'platform/forms/validations';
import VaTextInputField from '../web-component-fields/VaTextInputField';

export const symbolsValidation = (
  errors,
  value,
  _uiSchema,
  _schema,
  messages,
) => {
  // Validation 1: Check for bad symbols so that we can show the user
  // an error message specific to characters/symbols.
  // This ruleset should match RJSF 'email' format.
  // (Don't care about white space in this step, hence \s is OK)
  // ",][#" are some symbols not accepted.
  const invalidChars = /[^a-zA-Z0-9~!@$%^&*_=+}{'`?/.\s-]/g;
  const matches = value.match(invalidChars);

  if (matches) {
    const uniqueInvalidChars = [...new Set(matches)].join(', ');
    const staticText =
      messages?.symbols ||
      'You entered a character we can’t accept. Try removing';
    errors.addError(`${staticText} ${uniqueInvalidChars}.`);
  }
};

export const emailValidation = (
  errors,
  value,
  _uiSchema,
  _schema,
  messages,
) => {
  // Validation 2: Email formatting, white space, everything else
  // We prefer to show this validation for most cases because
  // it will have a more simple error message
  if (!isValidEmail(value)) {
    errors.addError(messages.format);
  }
};

/**
 * uiSchema for email
 * ```js
 * email: emailUI() // 'Email address'
 * email: emailUI('Your email address')
 * email: emailUI({
 *   title: "Custom email address",
 *   description: "By providing an email address, I agree to receive electronic correspondence from VA regarding my application",
 * })
 * ```
 * @param {string | UIOptions & {
 *   title?: UISchemaOptions['ui:title'],
 *   description?: UISchemaOptions['ui:description'],
 *   hint?: string
 *   errorMessages?: {
 *     required?: string
 *     format?: string
 *     symbols?: string
 *   }
 * }} [options] accepts a single string for title, or an object of options
 * @returns {UISchemaOptions} uiSchema
 */
const emailUI = options => {
  const { title, description, errorMessages, required, ...uiOptions } =
    typeof options === 'object' ? options : { title: options };
  return {
    'ui:title': title || 'Email address',
    'ui:autocomplete': 'email',
    'ui:description': description,
    'ui:webComponentField': VaTextInputField,
    'ui:validations': [symbolsValidation, emailValidation],
    'ui:required': required,
    'ui:errorMessages': {
      required:
        'Enter a valid email address without spaces using this format: email@domain.com',
      format:
        'Enter a valid email address without spaces using this format: email@domain.com',
      ...errorMessages,
    },
    'ui:options': {
      inputType: 'email',
      uswds: true,
      ...uiOptions,
    },
  };
};

/**
 * uiSchema for email which also has an additional hint explaining it will be used for notifications about form submission. Preferred if it is the only email field in the form. Generally required.
 * @param {UIOptions & {
 *  required?: (formData) => boolean
 * }} [options]
 */
const emailToSendNotificationsUI = (options = {}) => {
  return emailUI({
    title: 'Email',
    hint:
      'We’ll use this email address to send you notifications about your form submission',
    ...options,
  });
};

/**
 * schema for emailUI
 * ```js
 * schema: {
 *    exampleEmail: emailSchema
 * }
 * ```
 */
const emailSchema = {
  type: 'string',
  maxLength: 256,
};

/**
 * schema for emailToSendNotificationsUI
 * */
const emailToSendNotificationsSchema = emailSchema;

export {
  emailUI,
  emailToSendNotificationsUI,
  emailSchema,
  emailToSendNotificationsSchema,
};
