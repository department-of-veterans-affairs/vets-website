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
});
emailAddressUISchema['ui:required'] = formData =>
  !!formData?.['view:isEmailPresenceRequired'];

const isEmailPresenceRequired = appStateData =>
  !!appStateData?.isEmailPresenceRequired;

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

function validateEmailPresence(
  errors,
  fieldData,
  formData,
  _schema,
  _uiSchema,
  _index,
  appStateData,
) {
  if (!isEmailPresenceRequired(appStateData)) {
    return;
  }

  const email = fieldData?.emailAddress;
  if (!email || email.trim() === '') {
    errors.emailAddress.addError('Enter your email address');
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
    'ui:validations': [validateElectronicCorrespondence, validateEmailPresence],
  },
  schema: {
    type: 'object',
    properties: {
      phoneNumber: phoneSchema,
      mobilePhoneNumber: phoneSchema,
      emailAddress: emailToSendNotificationsSchema,
      electronicCorrespondence: { type: 'boolean' },
    },
    required: ['phoneNumber'],
  },
};
