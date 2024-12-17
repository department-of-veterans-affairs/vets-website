import React from 'react';

import { omit } from 'lodash';

import emailUI from 'platform/forms-system/src/js/definitions/email';
import formDefinitions from '../definitions/form-definitions';

import { CLAIM_OWNERSHIPS, CLAIMANT_TYPES } from '../definitions/constants';

const partialEmailUi = omit(emailUI(), ['ui:title', 'ui:options']);

/** @type {PageSchema} */
export default {
  uiSchema: {
    claimantPhone: {
      'ui:title': 'Phone number',
      'ui:autocomplete': 'tel',
      'ui:errorMessages': {
        minLength:
          'Please enter a 10-digit phone number (with or without dashes)',
        pattern:
          'Please enter a 10-digit phone number (with or without dashes)',
        required:
          'Please enter a 10-digit phone number (with or without dashes)',
      },
      'ui:options': {
        inputType: 'tel',
      },
    },
    claimantEmail: {
      ...partialEmailUi,
      'ui:options': {
        inputType: 'email',
        updateSchema: formData => {
          const { claimOwnership, claimantType } = formData;

          if (
            claimOwnership === CLAIM_OWNERSHIPS.SELF &&
            claimantType === CLAIMANT_TYPES.NON_VETERAN
          ) {
            return {
              title: (
                <span>
                  Email address
                  <br />
                  When you enter your email address, you agree to receive emails
                  from us about your claim.
                </span>
              ),
            };
          }

          return {
            title: 'Email address',
          };
        },
      },
    },
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
      claimantPhone: formDefinitions.phone,
      claimantEmail: formDefinitions.pdfEmail,
    },
  },
};
