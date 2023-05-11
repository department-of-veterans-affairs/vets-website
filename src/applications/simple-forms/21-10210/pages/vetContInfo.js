import React from 'react';

import { omit } from 'lodash';

import definitions from 'vets-json-schema/dist/definitions.json';
import emailUI from 'platform/forms-system/src/js/definitions/email';

import { CLAIMANT_TYPES, CLAIM_OWNERSHIPS } from '../definitions/constants';

const partialEmailUi = omit(emailUI(), ['ui:title', 'ui:options']);

export default {
  uiSchema: {
    veteranPhone: {
      'ui:title': 'Phone number',
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
                  By providing an email address, I agree to receive electronic
                  correspondence from VA regarding my application
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
    required: ['veteranPhone'],
    properties: {
      veteranPhone: definitions.phone,
      veteranEmail: definitions.email,
    },
  },
};
