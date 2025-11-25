import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameSchema,
  fullNameUI,
  titleUI,
  ssnOrVaFileNumberSchema,
  ssnOrVaFileNumberUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VET_SM_INFO_CHAPTER_CONSTANTS } from '../constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      VET_SM_INFO_CHAPTER_CONSTANTS.veteranServiceMemberInfoPageTitle,
      VET_SM_INFO_CHAPTER_CONSTANTS.veteranServiceMemberInfoPageDescription,
    ),
    fullName: fullNameUI(),
    ssn: ssnOrVaFileNumberUI(),
    dob: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    properties: {
      fullName: fullNameSchema,
      ssn: ssnOrVaFileNumberSchema,
      dob: dateOfBirthSchema,
    },
    required: ['fullName', 'ssn', 'dob'],
  },
};
