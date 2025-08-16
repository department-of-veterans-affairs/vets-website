import {
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { CLAIM_OWNERSHIPS, CLAIMANT_TYPES } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Phone and email address'),
    claimantPhone: phoneUI({
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
    claimantEmail: emailToSendNotificationsUI({
      inputType: 'email',
      updateUiSchema: formData => {
        const { claimOwnership, claimantType } = formData;

        if (
          claimOwnership === CLAIM_OWNERSHIPS.SELF &&
          claimantType === CLAIMANT_TYPES.NON_VETERAN
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
          claimantType === CLAIMANT_TYPES.NON_VETERAN
        ) {
          return {
            ...formSchema,
            required: ['claimantPhone', 'claimantEmail'],
          };
        }
        return {
          ...formSchema,
          required: ['claimantPhone'],
        };
      },
    },
  },
  schema: {
    type: 'object',
    required: ['claimantPhone'],
    properties: {
      claimantPhone: phoneSchema,
      claimantEmail: emailToSendNotificationsSchema,
    },
  },
};
