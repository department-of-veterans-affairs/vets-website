import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import PhoneNumberReviewWidget from 'platform/forms-system/src/js/review/PhoneNumberWidget';
import {
  phoneUI,
  emailUI,
  phoneSchema,
  emailSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { generateTitle } from '../../helpers';

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
      required: 'Enter an international phone number (with or without dashes)',
      pattern:
        'Enter a valid international phone number (with or without dashes)',
    },
  };
};

export const internationalPhoneSchema = {
  type: 'string',
  pattern: '^\\+?[0-9](?:-?[0-9]){6,14}$',
};

export const uiSchema = {
  'ui:title': generateTitle('Phone and email address'),
  phoneNumber: {
    ...phoneUI(),
    'ui:required': () => true,
  },
  internationalPhoneNumber: {
    ...internationalPhoneUI('International phone number'),
  },
  emailAddress: {
    ...emailUI('Email address'),
    'ui:options': {
      classNames: 'vads-u-margin-bottom--3',
    },
  },
  'view:electronicCorrespondence': {
    'ui:title':
      'I agree to receive electronic correspondence from the VA about my claim.',
    'ui:webComponentField': VaCheckboxField,
    'ui:options': {
      messageAriaDescribedby: `I agree to receive electronic correspondence from the VA about my claim`,
      classNames: 'custom-width',
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    phoneNumber: phoneSchema,
    internationalPhoneNumber: internationalPhoneSchema,
    emailAddress: emailSchema,
    'view:electronicCorrespondence': { type: 'boolean' },
  },
};
