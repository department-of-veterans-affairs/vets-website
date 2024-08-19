import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import PhoneNumberReviewWidget from 'platform/forms-system/src/js/review/PhoneNumberWidget';
import {
  phoneUI,
  emailUI,
  phoneSchema,
  emailSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { generateTitle } from '../../../utils/helpers';

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
    'ui:title': title ?? 'International phone number',
    'ui:webComponentField': VaTextInputField,
    'ui:reviewWidget': PhoneNumberReviewWidget,
    'ui:autocomplete': 'tel',
    'ui:options': {
      inputType: 'tel',
      ...uiOptions,
    },
    'ui:errorMessages': {
      required:
        'Please enter an international phone number (with or without dashes)',
      pattern:
        'Please enter a valid international phone number (with or without dashes)',
    },
  };
};

export const internationalPhoneSchema = {
  type: 'string',
  pattern: '^\\+?[0-9](?:-?[0-9]){6,14}$',
};

export default {
  uiSchema: {
    'ui:title': generateTitle('Contact information'),
    claimantEmail: {
      ...emailUI('Your email address'),
      'ui:options': {
        uswds: true,
      },
    },
    claimantPhone: {
      ...phoneUI('Your phone number'),
      'ui:options': {
        uswds: true,
      },
    },
    claimantIntPhone: {
      ...internationalPhoneUI('Your international phone number'),
      'ui:options': {
        uswds: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      claimantEmail: emailSchema,
      claimantPhone: phoneSchema,
      claimantIntPhone: internationalPhoneSchema,
    },
  },
};
