import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  largeTitleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { getFullNameLabels } from '../helpers';

/** @type {PageSchema} */
export const nameAndDateOfBirthPage = {
  uiSchema: {
    ...largeTitleUI('Name and date of birth'),
    fullName: fullNameNoSuffixUI(label => getFullNameLabels(label, false)),
    dateOfBirth: dateOfBirthUI({ required: true }),
  },
  schema: {
    type: 'object',
    properties: {
      fullName: fullNameNoSuffixSchema,
      dateOfBirth: dateOfBirthSchema,
    },
    required: ['fullName', 'dateOfBirth'],
  },
};
