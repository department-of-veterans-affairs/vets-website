import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import PersonalInformation from '../components/PersonalInformation';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': PersonalInformation,
    fullName: {
      ...fullNameNoSuffixUI(),
      'ui:options': {
        hideIf: () => true,
      },
    },
    dateOfBirth: {
      ...dateOfBirthUI(),
      'ui:options': {
        hideIf: () => true,
      },
    },
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
