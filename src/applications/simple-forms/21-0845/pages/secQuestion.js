import React from 'react';

import {
  THIRD_PARTY_TYPES,
  SECURITY_QUESTIONS,
} from '../definitions/constants';
import {
  getFullNameString,
  getLabelsFromConstants,
  snakeAllCapsToCamelCase,
} from '../utils';

/** @type {PageSchema} */
export default {
  uiSchema: {
    securityQuestion: {
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
        enum: Object.keys(SECURITY_QUESTIONS).map(key =>
          snakeAllCapsToCamelCase(key),
        ),
      },
    },
  },
};
