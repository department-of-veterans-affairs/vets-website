import {
  titleUI,
  ssnUI,
  ssnSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { isCustodian } from '../utils/helpers';

export const identificationTitle = formData =>
  `${isCustodian(formData) ? 'Child’s' : 'Your'} identification information`;

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(({ formData }) => identificationTitle(formData)),
    claimantSocialSecurityNumber: ssnUI(),
  },
  schema: {
    type: 'object',
    required: ['claimantSocialSecurityNumber'],
    properties: {
      claimantSocialSecurityNumber: ssnSchema,
    },
  },
};
