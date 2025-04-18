import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { MedallionsDescription } from '../components/MedallionsDescription';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Name and date of birth'),
    'ui:description': formContext => MedallionsDescription(formContext),
    fullName: fullNameNoSuffixUI(),
    dateOfBirth: dateOfBirthUI(),
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
