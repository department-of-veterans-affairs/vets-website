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
        <div className="custom-description">
          <p>
            Select a security question. We’ll ask you to enter the answer on the
            next screen. You’ll then need to give the answer to your designated
            third-party source.
          </p>
          <p>
            We’ll ask this question each time your designated third-party source
            contacts us.
          </p>
        </div>
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
              <h3 className="custom-header">
                What security question should we ask {thirdPartyName} to verify
                their identity?
                <span className="custom-required-span"> (*Required)</span>
              </h3>
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
