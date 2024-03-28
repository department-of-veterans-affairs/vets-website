import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { getFullNameLabels } from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Veteran’s name and date of birth',
      'Please provide the Veteran’s information.',
    ),
    veteranFullName: fullNameNoSuffixUI(label =>
      getFullNameLabels(label, true),
    ),
    veteranDateOfBirth: dateOfBirthUI({ required: true }),
  },
  schema: {
    type: 'object',
    properties: {
      veteranFullName: fullNameNoSuffixSchema,
      veteranDateOfBirth: dateOfBirthSchema,
    },
    required: ['veteranFullName', 'veteranDateOfBirth'],
  },
};
