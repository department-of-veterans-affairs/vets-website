// @ts-check
import {
  titleUI,
  phoneUI,
  phoneSchema,
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';

const phoneNumberUISchema = phoneUI('Home phone number');
phoneNumberUISchema['ui:errorMessages'] = {
  required: 'Please enter your 10-digit phone number (with or without dashes)',
};

const emailAddressUISchema = emailToSendNotificationsUI({
  title: 'Email address',
  hint: 'We’ll use this email address to confirm when we receive your form',
  'ui:required': true,
});

function validateElectronicCorrespondence(errors, fieldData, formData) {
  if (!formData?.['view:isEmailPresenceRequired']) {
    return;
  }
  const email = fieldData?.emailAddress;
  const wantsElectronic = fieldData?.electronicCorrespondence;
  if (wantsElectronic && (!email || email.trim() === '')) {
    errors.electronicCorrespondence.addError(
      'Enter an email address to receive electronic correspondence',
    );
  }
}

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your phone and email address'),
    phoneNumber: phoneNumberUISchema,
    mobilePhoneNumber: phoneUI('Mobile phone number'),
    emailAddress: emailAddressUISchema,

    electronicCorrespondence: {
      'ui:title':
        'I agree to receive electronic correspondence from the VA about my claim.',
      'ui:webComponentField': VaCheckboxField,
      'ui:options': {
        classNames: 'custom-width',
        hideIf: formData => !formData?.['view:isEmailPresenceRequired'],
      },
    },
    'ui:validations': [validateElectronicCorrespondence],
  },
  schema: {
    type: 'object',
    properties: {
      phoneNumber: phoneSchema,
      mobilePhoneNumber: phoneSchema,
      emailAddress: emailToSendNotificationsSchema,
      electronicCorrespondence: { type: 'boolean' },
    },
    required: ['phoneNumber', 'emailAddress'],
  },
};
