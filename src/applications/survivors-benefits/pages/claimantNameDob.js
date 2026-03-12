import {
  fullNameSchema,
  fullNameUI,
  titleUI,
  dateOfBirthSchema,
  dateOfBirthUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { isCustodian } from '../utils/helpers';

export const nameDobTitle = formData =>
  `${isCustodian(formData) ? 'Child’s' : 'Your'} name and date of birth`;

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(({ formData }) => nameDobTitle(formData)),
    claimantFullName: fullNameUI(),
    claimantDateOfBirth: dateOfBirthUI({
      monthSelect: false,
    }),
  },
  schema: {
    type: 'object',
    required: ['claimantFullName', 'claimantDateOfBirth'],
    properties: {
      claimantFullName: fullNameSchema,
      claimantDateOfBirth: dateOfBirthSchema,
    },
  },
};
