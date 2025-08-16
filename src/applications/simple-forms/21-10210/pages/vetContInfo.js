import {
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { CLAIMANT_TYPES, CLAIM_OWNERSHIPS } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Phone and email address'),
    veteranPhone: phoneUI({
      title: 'Phone number',
      autocomplete: 'tel',
      errorMessages: {
        minLength:
          'Please enter a 10-digit phone number (with or without dashes)',
        pattern:
          'Please enter a 10-digit phone number (with or without dashes)',
        required:
          'Please enter a 10-digit phone number (with or without dashes)',
      },
      inputType: 'tel',
    }),
    veteranEmail: emailToSendNotificationsUI({
      inputType: 'email',
      updateUiSchema: formData => {
        const { claimOwnership, claimantType } = formData;

        if (
          claimOwnership === CLAIM_OWNERSHIPS.SELF &&
          claimantType === CLAIMANT_TYPES.VETERAN
        ) {
          return {
            'ui:options': {
              hint:
                'We’ll use this email address to send you notifications about your form submission',
            },
          };
        }

        return {
          'ui:options': {
            hint: '',
          },
        };
      },
    }),
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        const { claimOwnership, claimantType } = formData;

        if (
          claimOwnership === CLAIM_OWNERSHIPS.SELF &&
          claimantType === CLAIMANT_TYPES.VETERAN
        ) {
          return { ...formSchema, required: ['veteranPhone', 'veteranEmail'] };
        }
        return {
          ...formSchema,
          required: ['veteranPhone'],
        };
      },
    },
  },
  schema: {
    type: 'object',
    required: ['veteranPhone'],
    properties: {
      veteranPhone: phoneSchema,
      veteranEmail: emailToSendNotificationsSchema,
    },
  },
};
