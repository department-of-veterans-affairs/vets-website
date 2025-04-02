import React from 'react';
import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  THIRD_PARTY_TYPES,
  SECURITY_QUESTIONS,
} from '../definitions/constants';
import {
  getEnumsFromConstants,
  getFullNameString,
  getLabelsFromConstants,
} from '../utils';

/** @type {PageSchema} */
export default {
  uiSchema: {
    securityQuestion: radioUI({
      description: (
        <>
          <p>
            Select a security question. We’ll ask you to enter the answer on the
            next screen. You’ll then need to give the answer to your designated
            third-party source.
          </p>
          <p>
            We’ll ask this question each time your designated third-party source
            contacts us.
          </p>
        </>
      ),
      labels: getLabelsFromConstants(SECURITY_QUESTIONS),
      errorMessages: {
        required: 'Please select a question.',
      },
      labelHeaderLevel: '3',
      updateSchema: formData => {
        const { thirdPartyType, personFullName, organizationName } = formData;
        let thirdPartyName = 'the third-party';

        if (
          thirdPartyType === THIRD_PARTY_TYPES.PERSON &&
          personFullName.first &&
          personFullName.last
        ) {
          thirdPartyName = getFullNameString(personFullName);
        } else if (
          thirdPartyType === THIRD_PARTY_TYPES.ORGANIZATION &&
          organizationName
        ) {
          thirdPartyName = organizationName;
        }

        return {
          title: `What security question should we ask ${thirdPartyName} to verify their identity?`,
        };
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['securityQuestion'],
    properties: {
      securityQuestion: radioSchema(getEnumsFromConstants(SECURITY_QUESTIONS)),
    },
  },
};
