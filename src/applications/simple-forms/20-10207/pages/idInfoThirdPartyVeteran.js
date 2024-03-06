import {
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
import { getIdentityInfoPageTitle } from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(({ formData }) => getIdentityInfoPageTitle(formData)),
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
