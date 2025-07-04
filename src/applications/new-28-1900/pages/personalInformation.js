import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameSchema,
  fullNameUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { YOUR_INFORMATION_CHAPTER_CONSTANTS } from '../constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(YOUR_INFORMATION_CHAPTER_CONSTANTS.personalInformationPageTitle),
    fullName: fullNameUI(),
    dob: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    properties: {
      fullName: fullNameSchema,
      dob: dateOfBirthSchema,
    },
    required: ['fullName', 'dob'],
  },
};
