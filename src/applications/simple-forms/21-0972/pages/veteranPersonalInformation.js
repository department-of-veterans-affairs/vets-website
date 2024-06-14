import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { veteranDescriptionText } from '../config/helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': formData => veteranDescriptionText(formData),
    veteranFullName: fullNameNoSuffixUI(),
    veteranDateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    properties: {
      veteranFullName: fullNameNoSuffixSchema,
      veteranDateOfBirth: dateOfBirthSchema,
    },
    required: ['veteranDateOfBirth'],
  },
};
