import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  ssnUI,
  ssnSchema,
  vaFileNumberUI,
  vaFileNumberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { hasSession } from '../../../helpers';

/** @type {PageSchema} */
export default {
  title: 'Veteran information',
  path: 'veteran/information',
  depends: formData => !(formData?.claimantType === 'VETERAN' && hasSession()),
  uiSchema: {
    ...titleUI('Veteran information'),
    otherVeteranFullName: fullNameNoSuffixUI(title => `Veteran’s ${title}`),
    otherVeteranSocialSecurityNumber: ssnUI('Veteran’s Social Security number'),
    otherVaFileNumber: vaFileNumberUI('VA File Number (if applicable)'),
  },
  schema: {
    type: 'object',
    required: ['otherVeteranFullName', 'otherVeteranSocialSecurityNumber'],
    properties: {
      otherVeteranFullName: fullNameNoSuffixSchema,
      otherVeteranSocialSecurityNumber: ssnSchema,
      otherVaFileNumber: vaFileNumberSchema,
    },
  },
};
