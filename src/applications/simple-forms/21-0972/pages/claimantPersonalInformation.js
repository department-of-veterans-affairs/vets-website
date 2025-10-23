import {
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { claimantExpectedInformationDescription } from '../config/helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': formData =>
      claimantExpectedInformationDescription(formData),
    claimantFullName: fullNameNoSuffixUI(),
  },
  schema: {
    type: 'object',
    properties: {
      claimantFullName: fullNameNoSuffixSchema,
    },
  },
};
