import React from 'react';

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
    securityQuestion: {
      'ui:description': (
        <>
          <p>
            Select the information you want us to ask for. Then give this
            information to your designated third-party source. We’ll ask them
            for this information each time they contact us.
          </p>
          <p>
            We’ll ask this question each time your designated third-party source
            contacts us.
          </p>
        </>
      ),
      'ui:widget': 'radio',
      'ui:errorMessages': {
        required: 'Please select a question.',
      },
      'ui:options': {
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
            title: (
              <span className="vads-u-font-family--serif vads-u-font-size--h4 vads-u-font-weight--bold">
                What security question should we ask {thirdPartyName} to verify
                their identity?
              </span>
            ),
          };
        },
        labels: getLabelsFromConstants(SECURITY_QUESTIONS),
      },
    },
  },
  schema: {
    type: 'object',
    required: ['securityQuestion'],
    properties: {
      securityQuestion: {
        type: 'string',
        enum: getEnumsFromConstants(SECURITY_QUESTIONS),
      },
    },
  },
};
