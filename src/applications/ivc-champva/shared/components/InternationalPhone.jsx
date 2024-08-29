import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import PhoneNumberReviewWidget from 'platform/forms-system/src/js/review/PhoneNumberWidget';

/**
 * @param {string | UIOptions & {
 *   title?: UISchemaOptions['ui:title'],
 *   hint?: string,
 * }} [options] accepts a single string for title, or an object of options
 * @returns {UISchemaOptions}
 */
export const internationalPhoneUI = options => {
  const { title, ...uiOptions } =
    typeof options === 'object' ? options : { title: options };

  return {
    'ui:title': title ?? 'Phone number',
    'ui:webComponentField': VaTextInputField,
    'ui:reviewWidget': PhoneNumberReviewWidget,
    'ui:autocomplete': 'tel',
    'ui:options': {
      inputType: 'tel',
      ...uiOptions,
    },
    'ui:errorMessages': {
      required: 'Please enter a phone number (with or without dashes)',
      pattern: 'Please enter a valid phone number (with or without dashes)',
    },
  };
};

export const internationalPhoneSchema = {
  type: 'string',
  pattern: '^\\+?[0-9 ](?:-?[0-9]){0,15}$',
};

export default {
  uiSchema: {
    claimantIntPhone: {
      ...internationalPhoneUI('Your phone number'),
      'ui:options': {
        uswds: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      claimantIntPhone: internationalPhoneSchema,
    },
  },
};
