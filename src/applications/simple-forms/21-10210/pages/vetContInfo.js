import React from 'react';

import { omit } from 'lodash';

import definitions from 'vets-json-schema/dist/definitions.json';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import formDefinitions from '../definitions/form-definitions';

import { CLAIMANT_TYPES, CLAIM_OWNERSHIPS } from '../definitions/constants';

const partialEmailUi = omit(emailUI(), ['ui:title', 'ui:options']);

/** @type {PageSchema} */
export default {
  uiSchema: {
    veteranPhone: {
      'ui:title': 'Phone number',
      'ui:autocomplete': 'tel-national',
    },
    veteranEmail: {
      ...partialEmailUi,
      'ui:options': {
        inputType: 'email',
        updateSchema: formData => {
          const { claimOwnership, claimantType } = formData;

          if (
            claimOwnership === CLAIM_OWNERSHIPS.SELF &&
            claimantType === CLAIMANT_TYPES.VETERAN
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
  },
  schema: {
    type: 'object',
    required: ['veteranPhone', 'veteranEmail'],
    properties: {
      veteranPhone: definitions.phone,
      veteranEmail: formDefinitions.pdfEmail,
    },
  },
};
