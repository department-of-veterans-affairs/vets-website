import {
  emailSchema,
  emailUI,
  firstNameLastNameNoSuffixSchema,
  firstNameLastNameNoSuffixUI,
  radioSchema,
  radioUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  THIRD_PARTY_TYPES,
  THIRD_PARTY_TYPE_VETERAN_LABELS,
  ADDITIONAL_INFO_THIRD_PARTY_TYPE,
} from '../config/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your name'),
    thirdPartyFullName: firstNameLastNameNoSuffixUI(),
    thirdPartyEmailAddress: emailUI({ title: 'Email' }),
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
      thirdPartyEmailAddress: emailSchema,
      thirdPartyType: radioSchema(Object.values(THIRD_PARTY_TYPES)),
      'view:additionalInfoThirdPartyType': {
        type: 'object',
        properties: {},
      },
    },
    required: [
      'thirdPartyFullName',
      'thirdPartyType',
      'thirdPartyEmailAddress',
    ],
  },
};
