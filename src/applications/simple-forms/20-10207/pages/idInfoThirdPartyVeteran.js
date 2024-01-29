import React from 'react';

import {
  firstNameLastNameNoSuffixSchema,
  firstNameLastNameNoSuffixUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  THIRD_PARTY_TYPES,
  THIRD_PARTY_TYPE_VETERAN_LABELS,
  ADDITIONAL_INFO_THIRD_PARTY_TYPE,
} from '../config/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': <h3 className="vads-u-margin-y--0">Your name</h3>,
    thirdPartyFullName: firstNameLastNameNoSuffixUI(),
    thirdPartyType: radioUI({
      title: 'How are you representing the Veteran?',
      labels: THIRD_PARTY_TYPE_VETERAN_LABELS,
      errorMessages: {
        required: 'Select your identity',
      },
      labelHeaderLevel: '3',
    }),
    'view:additionalInfoThirdPartyType': {
      'ui:description': ADDITIONAL_INFO_THIRD_PARTY_TYPE,
    },
  },
  schema: {
    type: 'object',
    properties: {
      thirdPartyFullName: firstNameLastNameNoSuffixSchema,
      thirdPartyType: radioSchema(Object.values(THIRD_PARTY_TYPES)),
      'view:additionalInfoThirdPartyType': {
        type: 'object',
        properties: {},
      },
    },
    required: ['thirdPartyFullName', 'thirdPartyType'],
  },
};
