import {
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleH1UI } from '../components/customTitlePattern';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleH1UI('Your name and date of birth'),
    veteranFullName: fullNameNoSuffixUI(),
    veteranDateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    required: ['veteranFullName'],
    properties: {
      veteranFullName: fullNameNoSuffixSchema,
      veteranDateOfBirth: dateOfBirthSchema,
    },
  },
};
