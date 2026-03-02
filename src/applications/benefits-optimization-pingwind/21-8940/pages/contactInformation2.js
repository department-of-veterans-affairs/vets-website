import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import {
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  titleUI,
  internationalPhoneSchema,
  internationalPhoneUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import TelephoneFieldNoInternalErrors from '../components/TelephoneFieldNoInternalErrors';

import { veteranFields } from '../definitions/constants';

function validateElectronicCorrespondence(errors, fieldData, formData) {

 if (!formData?.['view:isEmailPresenceRequired']) {
    return;
  }

  const email = fieldData?.email;
  const wantsElectronic = fieldData?.electronicCorrespondence;
  if (wantsElectronic && (!email || email.trim() === '')) {
    errors.electronicCorrespondence.addError(
      'Enter an email address to receive electronic correspondence'
    );
  }
}

const emailAddressUISchema = emailToSendNotificationsUI({
  title: 'Email address',
  hint: 'We’ll use this email address to confirm when we receive your form',
});
emailAddressUISchema['ui:required'] = formData =>
  !!formData?.['view:isEmailPresenceRequired'];



/** @type {PageSchema} */
export default {
  uiSchema: {
    [veteranFields.parentObject]: {
      ...titleUI('Contact information', 'How can we reach you?'),
      [veteranFields.homePhone]: {
        ...internationalPhoneUI({
          title: 'Primary phone number',
        }),
        'ui:webComponentField': TelephoneFieldNoInternalErrors,
        'ui:required': () => true,
      },
      [veteranFields.alternatePhone]: {
        ...internationalPhoneUI({
          title: 'Alternate or international phone number (if applicable)',
          hideEmptyValueInReview: true,
        }),
        'ui:webComponentField': TelephoneFieldNoInternalErrors,
      },
      [veteranFields.email]: emailAddressUISchema,
      [veteranFields.electronicCorrespondence]: {
        'ui:title':
          'I agree to receive electronic correspondence from the VA about my claim.',
        'ui:webComponentField': VaCheckboxField,
        'ui:options': {
          classNames: 'custom-width',
        },
      },
      'ui:validations': [validateElectronicCorrespondence],
    },
  },
  schema: {
    type: 'object',
    properties: {
      [veteranFields.parentObject]: {
        type: 'object',
        required: [veteranFields.homePhone, veteranFields.email],
        properties: {
          [veteranFields.homePhone]: internationalPhoneSchema({
            required: true,
          }),
          [veteranFields.alternatePhone]: internationalPhoneSchema(),
          [veteranFields.email]: emailToSendNotificationsSchema,
          [veteranFields.electronicCorrespondence]: { type: 'boolean' },
        },
      },
    },
  },
};
